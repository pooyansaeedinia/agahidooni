from django.core.signing import TimestampSigner, BadSignature, SignatureExpired

signer = TimestampSigner(salt="accounts.email_activation")


def generate_activation_token(user):
    return signer.sign(str(user.pk))


def verify_activation_token(user, token):
    try:
        user_id = signer.unsign(
            token,
            max_age=60 * 60 * 24
        )

        return user_id == str(user.pk)

    except (BadSignature, SignatureExpired):
        return False
