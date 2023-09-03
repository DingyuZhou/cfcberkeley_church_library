DROP FUNCTION IF EXISTS renew_book(i_renewer_uuid TEXT, i_one_time_password TEXT, i_checkout_passcode TEXT, i_item_id BIGINT);


CREATE OR REPLACE FUNCTION renew_book(i_renewer_uuid TEXT, i_one_time_password TEXT, i_checkout_passcode TEXT, i_item_id BIGINT)
  RETURNS TABLE(
    borrower_id BIGINT,
    item_id BIGINT,
    due_at TIMESTAMP WITH TIME ZONE,
    checkout_status TEXT,
    error_message TEXT
  )
  LANGUAGE plpgsql
AS $$

DECLARE v_renewer_id BIGINT := NULL;
DECLARE v_borrower_id BIGINT := NULL;
DECLARE v_item_to_renew_id BIGINT := NULL;
DECLARE v_remaining_retry_count INTEGER := NULL;
DECLARE v_passcode_expire_at TIMESTAMP WITH TIME ZONE := NULL;
DECLARE v_checkout_status TEXT := NULL;
DECLARE v_error_message TEXT := '';
DECLARE v_due_at TIMESTAMP WITH TIME ZONE := NULL;

BEGIN

  SELECT bb.id INTO v_renewer_id FROM book_borrower AS bb
  WHERE bb.uuid = i_renewer_uuid
    AND bb.one_time_password_hash = CRYPT(i_one_time_password, bb.one_time_password_hash)
    AND bb.checkout_passcode_hash = CRYPT(i_checkout_passcode, bb.checkout_passcode_hash)
    AND bb.passcode_expire_at > NOW()
    AND bb.remaining_retry_count > 0;

  IF v_renewer_id IS NULL THEN
    UPDATE book_borrower SET remaining_retry_count = remaining_retry_count - 1
    WHERE book_borrower.uuid = i_renewer_uuid
    RETURNING book_borrower.passcode_expire_at, book_borrower.remaining_retry_count INTO v_passcode_expire_at, v_remaining_retry_count;

    SELECT
      'ERROR' AS checkout_status,
      CASE
        WHEN v_passcode_expire_at < NOW() THEN 'The renew passcode has expired. Please re-generate one.'
        WHEN v_remaining_retry_count < 0 THEN 'This renew passcode has been attempted too many times. Please re-generate one.'
        ELSE 'The renew passcode is not correct'
      END AS error_message
    INTO v_checkout_status, v_error_message;
  ELSE
    SELECT i.borrower_id INTO v_borrower_id FROM item AS i WHERE i.id = i_item_id;

    IF v_borrower_id = v_renewer_id THEN
      BEGIN
        UPDATE item SET
          due_at = item.borrowed_at + INTERVAL '45 DAYS',
          has_renewed = TRUE
        WHERE item.id = i_item_id
          AND item.status = 'BORROWED'
          AND item.has_renewed = FALSE
          AND item.borrower_id = v_renewer_id
        RETURNING item.id, item.due_at INTO v_item_to_renew_id, v_due_at;

        IF v_item_to_renew_id IS NULL THEN
          SELECT
            'ERROR' AS checkout_status,
            'The book is not available.' AS error_message
          INTO v_checkout_status, v_error_message;
        ELSE
          UPDATE book_borrower SET
            checkout_passcode_hash = NULL,
            passcode_expire_at = NULL,
            one_time_password_hash = NULL,
            remaining_retry_count = NULL,
            is_phone_number_verified = TRUE
          WHERE book_borrower.id = v_renewer_id;

          SELECT 'SUCCESS' INTO v_checkout_status;
        END IF;
      END;
    ELSE
      SELECT
        'ERROR' AS checkout_status,
        'You do not permission to renew, because the book is not originally borrowed by you. ' AS error_message
      INTO v_checkout_status, v_error_message;
    END IF;
  END IF;

  RETURN QUERY
    SELECT
      v_renewer_id AS borrower_id,
      i_item_id AS item_id,
      v_due_at AS due_at,
      v_checkout_status AS checkout_status,
      v_error_message AS error_message;

END
$$;
