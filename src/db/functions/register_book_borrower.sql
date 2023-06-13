DROP FUNCTION IF EXISTS register_book_borrower(i_first_name TEXT, i_last_name TEXT, i_phone_number TEXT, i_checkout_passcode TEXT);


CREATE OR REPLACE FUNCTION register_book_borrower(i_first_name TEXT, i_last_name TEXT, i_phone_number TEXT, i_checkout_passcode TEXT)
  RETURNS TABLE(
    borrower_uuid TEXT,
    one_time_password TEXT
  )
  LANGUAGE plpgsql
AS $$

DECLARE v_borrower_id BIGINT := NULL;
DECLARE v_borrower_uuid TEXT := NULL;
DECLARE v_one_time_password TEXT := NULL;

BEGIN
  SELECT bb.id INTO v_borrower_id FROM book_borrower AS bb
  WHERE bb.phone_number = i_phone_number;

  SELECT uuid_generate_v4() INTO v_one_time_password;

  IF v_borrower_id IS NULL THEN
    SELECT uuid_generate_v4() INTO v_borrower_uuid;

    INSERT INTO book_borrower (
      uuid,
      first_name,
      last_name,
      phone_number,
      checkout_passcode_hash,
      passcode_expire_at,
      one_time_password_hash,
      remaining_retry_count
    ) VALUES (
      v_borrower_uuid,
      i_first_name,
      i_last_name,
      i_phone_number,
      CRYPT(i_checkout_passcode, GEN_SALT('bf')),
      (NOW() + INTERVAL '15 MINUTES'),
      CRYPT(v_one_time_password, GEN_SALT('bf')),
      5
    );
  ELSE
    UPDATE book_borrower SET
      first_name = i_first_name,
      last_name = i_last_name,
      checkout_passcode_hash = CRYPT(i_checkout_passcode, GEN_SALT('bf')),
      passcode_expire_at = (NOW() + INTERVAL '15 MINUTES'),
      one_time_password_hash = CRYPT(v_one_time_password, GEN_SALT('bf')),
      remaining_retry_count = 5
    WHERE book_borrower.id = v_borrower_id
    RETURNING book_borrower.uuid INTO v_borrower_uuid;
  END IF;

  RETURN QUERY
    SELECT
      v_borrower_uuid AS borrower_uuid,
      v_one_time_password AS one_time_password;

END
$$;
