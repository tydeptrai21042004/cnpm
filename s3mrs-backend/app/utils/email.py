# app/utils/email.py

import smtplib
from email.mime.text import MIMEText
from flask import current_app

def send_email(subject: str, recipient: str, body: str):
    """
    Send a simple text email using SMTP settings in app.config.
    If any required config is missing, logs an error and returns quietly.
    """
    cfg = current_app.config

    mail_server   = cfg.get("MAIL_SERVER")
    mail_port     = cfg.get("MAIL_PORT")
    mail_username = cfg.get("MAIL_USERNAME")
    mail_password = cfg.get("MAIL_PASSWORD")
    mail_sender   = cfg.get("MAIL_DEFAULT_SENDER", mail_username)
    use_tls       = cfg.get("MAIL_USE_TLS", False)

    # 1) Validate config
    if not mail_server or not mail_port:
        current_app.logger.error("send_email: MAIL_SERVER or MAIL_PORT not configured")
        return
    if not mail_username or not mail_password:
        current_app.logger.error("send_email: MAIL_USERNAME or MAIL_PASSWORD not configured")
        return
    if not mail_sender:
        current_app.logger.error("send_email: MAIL_DEFAULT_SENDER not configured")
        return

    # 2) Build message
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"]    = mail_sender
    msg["To"]      = recipient

    # 3) Send
    try:
        smtp = smtplib.SMTP(mail_server, mail_port, timeout=10)
        if use_tls:
            smtp.starttls()
        smtp.login(mail_username, mail_password)
        smtp.sendmail(mail_sender, [recipient], msg.as_string())
        smtp.quit()
        current_app.logger.info(f"send_email: message sent to {recipient}")
    except Exception as e:
        current_app.logger.error(f"send_email: failed to send to {recipient}: {e}")
