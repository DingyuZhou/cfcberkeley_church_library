DROP FUNCTION IF EXISTS book_borrow_checkout(i_borrower_uuid TEXT, i_one_time_password TEXT, i_checkout_passcode TEXT, i_item_id BIGINT);


CREATE OR REPLACE FUNCTION book_borrow_checkout(i_borrower_uuid TEXT, i_one_time_password TEXT, i_checkout_passcode TEXT, i_item_id BIGINT)
  RETURNS TABLE(
    borrower_id BIGINT,
    phone_number TEXT,
    item_id BIGINT,
    due_at TIMESTAMP WITH TIME ZONE,
    checkout_status TEXT,
    error_message TEXT
  )
  LANGUAGE plpgsql
AS $$

DECLARE v_borrower_id BIGINT := NULL;
DECLARE v_phone_number TEXT := '';
DECLARE v_item_to_borrow_id BIGINT := NULL;
DECLARE v_remaining_retry_count INTEGER := NULL;
DECLARE v_passcode_expire_at TIMESTAMP WITH TIME ZONE := NULL;
DECLARE v_checkout_status TEXT := NULL;
DECLARE v_error_message TEXT := '';
DECLARE v_borrowed_at TIMESTAMP WITH TIME ZONE := NOW();
DECLARE v_due_at TIMESTAMP WITH TIME ZONE := NULL;

BEGIN

  SELECT bb.id, bb.phone_number INTO v_borrower_id, v_phone_number FROM book_borrower AS bb
  WHERE bb.uuid = i_borrower_uuid
    AND bb.one_time_password_hash = CRYPT(i_one_time_password, bb.one_time_password_hash)
    AND bb.checkout_passcode_hash = CRYPT(i_checkout_passcode, bb.checkout_passcode_hash)
    AND bb.passcode_expire_at > NOW()
    AND bb.remaining_retry_count > 0;

  IF v_borrower_id IS NULL THEN
    UPDATE book_borrower SET remaining_retry_count = remaining_retry_count - 1
    WHERE book_borrower.uuid = i_borrower_uuid
    RETURNING book_borrower.passcode_expire_at, book_borrower.remaining_retry_count INTO v_passcode_expire_at, v_remaining_retry_count;

    SELECT
      'ERROR' AS checkout_status,
      CASE
        WHEN v_passcode_expire_at < NOW() THEN 'The checkout passcode has expired. Please re-generate one.'
        WHEN v_remaining_retry_count < 0 THEN 'This checkout passcode has been attempted too many times. Please re-generate one.'
        ELSE 'The checkout passcode is not correct'
      END AS error_message
    INTO v_checkout_status, v_error_message;
  ELSE
    BEGIN
      UPDATE item SET
        status = 'BORROWED',
        borrower_id = v_borrower_id,
        borrowed_at = v_borrowed_at,
        due_at = v_borrowed_at + INTERVAL '30 DAYS',
        has_renewed = FALSE
      WHERE item.id = i_item_id
        AND item.status = 'AVAILABLE'
      RETURNING item.id, item.due_at INTO v_item_to_borrow_id, v_due_at;

      IF v_item_to_borrow_id IS NULL THEN
        SELECT
          'ERROR' AS checkout_status,
          'The book is not available.' AS error_message
        INTO v_checkout_status, v_error_message;
      ELSE
        INSERT INTO book_borrow_history (borrower_id, item_id, borrowed_at)
        VALUES (v_borrower_id, i_item_id, v_borrowed_at);

        UPDATE book_borrower SET
          checkout_passcode_hash = NULL,
          passcode_expire_at = NULL,
          one_time_password_hash = NULL,
          remaining_retry_count = NULL,
          is_phone_number_verified = TRUE
        WHERE book_borrower.id = v_borrower_id;

        SELECT 'SUCCESS' INTO v_checkout_status;
      END IF;
    END;
  END IF;

  RETURN QUERY
    SELECT
      v_borrower_id AS borrower_id,
      v_phone_number AS phone_number,
      i_item_id AS item_id,
      v_due_at AS due_at,
      v_checkout_status AS checkout_status,
      v_error_message AS error_message;

END
$$;
