"""
Email notification utilities
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from datetime import datetime
from typing import Optional
import os

from app.config import (
    SMTP_SERVER,
    SMTP_PORT,
    SMTP_USERNAME,
    SMTP_PASSWORD,
    EMAIL_FROM_NAME,
    EMAIL_FROM_ADDRESS
)


def send_email(
    to_email: str,
    subject: str,
    html_body: str,
    text_body: Optional[str] = None,
    attachment_path: Optional[str] = None,
    attachment_name: Optional[str] = None
) -> bool:
    """
    Send email with optional attachment
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        html_body: HTML email body
        text_body: Plain text fallback (optional)
        attachment_path: Path to attachment file (optional)
        attachment_name: Name for attachment (optional)
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = f"{EMAIL_FROM_NAME} <{EMAIL_FROM_ADDRESS}>"
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Add text and HTML parts
        if text_body:
            part1 = MIMEText(text_body, 'plain')
            msg.attach(part1)
        
        part2 = MIMEText(html_body, 'html')
        msg.attach(part2)
        
        # Add attachment if provided
        if attachment_path and os.path.exists(attachment_path):
            with open(attachment_path, 'rb') as file:
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(file.read())
                encoders.encode_base64(part)
                part.add_header(
                    'Content-Disposition',
                    f'attachment; filename={attachment_name or os.path.basename(attachment_path)}'
                )
                msg.attach(part)
        
        # Send email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
        
        return True
    
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False


def get_status_update_email(
    applicant_name: str,
    vacancy_title: str,
    old_stage: str,
    new_stage: str,
    notes: Optional[str] = None
) -> tuple[str, str]:
    """
    Generate status update email content
    
    Returns:
        tuple: (subject, html_body)
    """
    subject = f"Application Status Update - {vacancy_title}"
    
    stage_messages = {
        "Under Review": "Your application is currently being reviewed by our team.",
        "Shortlisted": "Congratulations! You have been shortlisted for the next round.",
        "Interview Scheduled": "We would like to schedule an interview with you.",
        "Background Check": "We are proceeding with background verification.",
        "Offer Released": "Congratulations! We are pleased to extend an offer to you.",
        "Rejected": "After careful consideration, we have decided to proceed with other candidates."
    }
    
    stage_colors = {
        "Under Review": "#0057D9",
        "Shortlisted": "#3CB878",
        "Interview Scheduled": "#FFB020",
        "Background Check": "#00A8E8",
        "Offer Released": "#3CB878",
        "Rejected": "#E53935"
    }
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f7fb;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #0057D9 0%, #1B1F3B 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Application Status Update</h1>
            </div>
            
            <!-- Content -->
            <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <p style="font-size: 16px; color: #1B1F3B; margin-bottom: 20px;">Dear {applicant_name},</p>
                
                <p style="font-size: 16px; color: #6B7280; line-height: 1.6;">
                    We wanted to update you on the status of your application for the position of <strong style="color: #1B1F3B;">{vacancy_title}</strong>.
                </p>
                
                <!-- Status Badge -->
                <div style="background-color: #f4f7fb; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center;">
                    <p style="font-size: 14px; color: #6B7280; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Current Status</p>
                    <div style="background-color: {stage_colors.get(new_stage, '#6B7280')}; color: white; padding: 12px 24px; border-radius: 8px; display: inline-block; font-size: 18px; font-weight: bold;">
                        {new_stage}
                    </div>
                    <p style="font-size: 16px; color: #1B1F3B; margin-top: 20px; line-height: 1.6;">
                        {stage_messages.get(new_stage, "Your application status has been updated.")}
                    </p>
                </div>
                
                {f'''
                <div style="background-color: #FFF8E1; border-left: 4px solid #FFB020; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="font-size: 14px; color: #1B1F3B; margin: 0;"><strong>Note from Hiring Team:</strong></p>
                    <p style="font-size: 14px; color: #1B1F3B; margin: 10px 0 0 0; line-height: 1.6;">{notes}</p>
                </div>
                ''' if notes else ''}
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #E5E7EB;">
                    <p style="font-size: 14px; color: #6B7280; line-height: 1.6;">
                        If you have any questions or need further information, please don't hesitate to contact us.
                    </p>
                    <p style="font-size: 14px; color: #6B7280; margin-top: 20px;">
                        Best regards,<br>
                        <strong style="color: #1B1F3B;">HR Team</strong><br>
                        Electronics Corporation
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding: 20px; color: #6B7280; font-size: 12px;">
                <p>© 2025 Electronics Corporation. All rights reserved.</p>
                <p style="margin-top: 10px;">
                    This is an automated message. Please do not reply to this email.
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return subject, html_body


def get_offer_letter_email(
    applicant_name: str,
    vacancy_title: str,
    salary: Optional[str] = None,
    start_date: Optional[str] = None
) -> tuple[str, str]:
    """
    Generate offer letter email content
    
    Returns:
        tuple: (subject, html_body)
    """
    subject = f"🎉 Job Offer - {vacancy_title}"
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f7fb;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #3CB878 0%, #2FA366 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
                <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
                <h1 style="color: white; margin: 0; font-size: 32px;">Congratulations!</h1>
                <p style="color: rgba(255,255,255,0.9); margin-top: 10px; font-size: 18px;">You've been selected!</p>
            </div>
            
            <!-- Content -->
            <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <p style="font-size: 16px; color: #1B1F3B; margin-bottom: 20px;">Dear {applicant_name},</p>
                
                <p style="font-size: 16px; color: #6B7280; line-height: 1.8;">
                    We are thrilled to inform you that after careful consideration of your application and interview performance, 
                    we would like to offer you the position of <strong style="color: #1B1F3B;">{vacancy_title}</strong> at Electronics Corporation.
                </p>
                
                <!-- Offer Details -->
                <div style="background: linear-gradient(135deg, #E3F2FD 0%, #F4F7FB 100%); padding: 30px; border-radius: 12px; margin: 30px 0; border: 2px solid #0057D9;">
                    <h2 style="color: #0057D9; margin-top: 0; font-size: 20px; margin-bottom: 20px;">📋 Offer Details</h2>
                    
                    <div style="margin-bottom: 15px;">
                        <p style="color: #6B7280; margin: 0; font-size: 14px;">Position</p>
                        <p style="color: #1B1F3B; margin: 5px 0 0 0; font-size: 18px; font-weight: bold;">{vacancy_title}</p>
                    </div>
                    
                    {f'''
                    <div style="margin-bottom: 15px; margin-top: 20px;">
                        <p style="color: #6B7280; margin: 0; font-size: 14px;">Compensation</p>
                        <p style="color: #3CB878; margin: 5px 0 0 0; font-size: 18px; font-weight: bold;">{salary}</p>
                    </div>
                    ''' if salary else ''}
                    
                    {f'''
                    <div style="margin-top: 20px;">
                        <p style="color: #6B7280; margin: 0; font-size: 14px;">Expected Start Date</p>
                        <p style="color: #1B1F3B; margin: 5px 0 0 0; font-size: 18px; font-weight: bold;">{start_date}</p>
                    </div>
                    ''' if start_date else ''}
                </div>
                
                <!-- Benefits -->
                <div style="background-color: #F4F7FB; padding: 25px; border-radius: 12px; margin: 25px 0;">
                    <h3 style="color: #1B1F3B; margin-top: 0; font-size: 18px; margin-bottom: 15px;">✨ What's Included</h3>
                    <ul style="color: #6B7280; line-height: 2; padding-left: 20px; margin: 0;">
                        <li>Competitive salary package</li>
                        <li>Health insurance coverage</li>
                        <li>Professional development opportunities</li>
                        <li>Flexible working arrangements</li>
                        <li>Collaborative work environment</li>
                    </ul>
                </div>
                
                <!-- Next Steps -->
                <div style="background-color: #FFF8E1; border-left: 4px solid #FFB020; padding: 20px; border-radius: 8px; margin: 25px 0;">
                    <h3 style="color: #1B1F3B; margin-top: 0; font-size: 18px; margin-bottom: 10px;">📝 Next Steps</h3>
                    <p style="color: #1B1F3B; line-height: 1.8; margin: 0; font-size: 14px;">
                        Our HR team will reach out to you within the next 2-3 business days with the formal offer letter 
                        and additional details regarding the onboarding process. Please prepare any required documents 
                        for the joining formalities.
                    </p>
                </div>
                
                <p style="font-size: 16px; color: #6B7280; line-height: 1.8; margin-top: 30px;">
                    We are excited about the prospect of you joining our team and contributing to our continued success. 
                    Welcome aboard!
                </p>
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #E5E7EB;">
                    <p style="font-size: 14px; color: #6B7280; line-height: 1.6;">
                        If you have any questions, please feel free to contact us at hr@electronics.com or call us at +91 1234567890.
                    </p>
                    <p style="font-size: 14px; color: #6B7280; margin-top: 20px;">
                        Warm regards,<br>
                        <strong style="color: #1B1F3B;">HR Department</strong><br>
                        Electronics Corporation
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding: 20px; color: #6B7280; font-size: 12px;">
                <p>© 2025 Electronics Corporation. All rights reserved.</p>
                <p style="margin-top: 10px;">
                    This offer is confidential and intended solely for the addressee.
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return subject, html_body


def send_application_status_update(
    applicant_email: str,
    applicant_name: str,
    vacancy_title: str,
    old_stage: str,
    new_stage: str,
    notes: Optional[str] = None,
    salary: Optional[str] = None
) -> bool:
    """
    Send application status update email
    If status is "Offer Released", send offer letter instead
    
    Returns:
        bool: True if email sent successfully
    """
    try:
        if new_stage == "Offer Released":
            # Send offer letter
            subject, html_body = get_offer_letter_email(
                applicant_name=applicant_name,
                vacancy_title=vacancy_title,
                salary=salary,
                start_date="As per discussion with HR"
            )
        else:
            # Send regular status update
            subject, html_body = get_status_update_email(
                applicant_name=applicant_name,
                vacancy_title=vacancy_title,
                old_stage=old_stage,
                new_stage=new_stage,
                notes=notes
            )
        
        return send_email(
            to_email=applicant_email,
            subject=subject,
            html_body=html_body
        )
    
    except Exception as e:
        print(f"Error sending application status email: {str(e)}")
        return False
