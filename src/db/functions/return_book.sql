DROP FUNCTION IF EXISTS return_book(i_item_id BIGINT);


CREATE OR REPLACE FUNCTION return_book(i_item_id BIGINT)
  RETURNS TABLE(
    item_id BIGINT,
    status TEXT,
    error_message TEXT
  )
  LANGUAGE plpgsql
AS $$

DECLARE v_borrowed_item_id BIGINT := NULL;
DECLARE v_borrower_id BIGINT := NULL;
DECLARE v_status TEXT := NULL;
DECLARE v_error_message TEXT := '';

BEGIN

  SELECT i.id, i.borrower_id INTO v_borrowed_item_id, v_borrower_id FROM item AS i
  WHERE i.id = i_item_id;

  IF v_borrower_id IS NULL THEN
    SELECT
      'ERROR' AS status,
      CASE
        WHEN v_borrowed_item_id IS NULL THEN 'Fail to find the book.'
        WHEN v_borrower_id IS NULL THEN 'The book has not been borrowed yet.'
        ELSE 'Unknown issue. Please report this to the library administrator. Thanks!'
      END AS error_message
    INTO v_status, v_error_message;
  ELSE
    BEGIN
      UPDATE item SET
        status = 'AVAILABLE',
        borrower_id = NULL,
        borrowed_at = NULL,
        due_at = NULL,
        has_renewed = FALSE
      WHERE item.id = v_borrowed_item_id;

      UPDATE book_borrow_history SET returned_at = NOW() FROM (
        SELECT bbh.id AS history_id FROM book_borrow_history AS bbh
        WHERE bbh.item_id = v_borrowed_item_id
          AND bbh.borrower_id = v_borrower_id
          AND bbh.returned_at IS NULL
        ORDER BY bbh.borrowed_at DESC
        LIMIT 1
      ) AS tmp
      WHERE book_borrow_history.id = tmp.history_id;
    END;

    SELECT 'SUCCESS' INTO v_status;
  END IF;

  RETURN QUERY
    SELECT
      i_item_id AS item_id,
      v_status AS status,
      v_error_message AS error_message;

END
$$;
