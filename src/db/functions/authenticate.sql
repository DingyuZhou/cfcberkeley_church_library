DROP FUNCTION IF EXISTS authenticate(i_email TEXT, i_password TEXT);


CREATE OR REPLACE FUNCTION authenticate(i_email TEXT, i_password TEXT)
RETURNS TABLE(session_token TEXT, session_secret TEXT)
  STRICT
  SECURITY DEFINER
  LANGUAGE PLPGSQL
AS
$$

DECLARE
  authorized_member RECORD;

BEGIN

  SELECT
    m.id AS member_id,
    uuid_generate_v4()::TEXT AS session_token,
    uuid_generate_v4()::TEXT AS session_secret
  INTO authorized_member
  FROM member AS m
  WHERE m.email = TRIM(LOWER(i_email))
    AND m.password_hash = CRYPT(i_password, m.password_hash)
  LIMIT 1;

  IF authorized_member IS NOT NULL THEN
    INSERT INTO member_session (token, secret_hash, member_id, created_at)
    VALUES (authorized_member.session_token, CRYPT(authorized_member.session_secret, GEN_SALT('bf')), authorized_member.member_id, NOW());

    DELETE FROM member_session WHERE created_at < (NOW() - INTERVAL '3 MONTHS');

    RETURN QUERY
      SELECT authorized_member.session_token, authorized_member.session_secret;
  ELSE
    -- return nothing
    RETURN QUERY
      SELECT NULL::TEXT AS invalid_token, NULL::TEXT AS invalid_secret WHERE FALSE;
  END IF;

END;

$$;
