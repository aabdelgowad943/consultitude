<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        /* Reset styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f8f9fa;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        
        .verification-code {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            padding: 20px 30px;
            border-radius: 12px;
            margin: 30px 0;
            display: inline-block;
            box-shadow: 0 8px 25px rgba(240, 147, 251, 0.3);
            font-family: 'Courier New', monospace;
        }
        
        .message {
            font-size: 16px;
            color: #555555;
            margin-bottom: 25px;
            line-height: 1.8;
        }
        
        .cta-button {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 15px 35px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            display: inline-block;
            margin: 20px 0;
            box-shadow: 0 6px 20px rgba(79, 172, 254, 0.3);
            transition: transform 0.2s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .security-note {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            color: #856404;
        }
        
        .security-note h3 {
            font-size: 16px;
            margin-bottom: 10px;
            color: #856404;
        }
        
        .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        
        .footer p {
            font-size: 14px;
            color: #6c757d;
            margin-bottom: 10px;
        }
        
        .social-links {
            margin-top: 20px;
        }
        
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #6c757d;
            text-decoration: none;
        }
        
        /* Mobile responsiveness */
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .header, .content, .footer {
                padding: 25px 20px;
            }
            
            .verification-code {
                font-size: 24px;
                letter-spacing: 4px;
                padding: 15px 20px;
            }
            
            .header h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header Section -->
        <div class="header">
            <h1>🔐 Verify Your Email</h1>
            <p>We're excited to have you on board!</p>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <p class="message">
                Hi there! 👋<br><br>
                To complete your account setup, please use the verification code below. 
                This code will expire in <strong>10 minutes</strong> for your security.
            </p>
            
            <!-- Verification Code -->
            <div class="verification-code">
                {{verification_code}} code
            </div>
            
            <!-- Alternative CTA Button -->
            <!--<a href="{{verification_link}}" class="cta-button">-->
            <!--    Verify Email Address-->
            <!--</a>-->
            
            <!-- Security Note -->
            <div class="security-note">
                <h3>🛡️ Security Notice</h3>
                <p>
                    If you didn't request this verification, please ignore this email. 
                    Never share this code with anyone. Our team will never ask for your verification code.
                </p>
            </div>
            
            <p class="message">
                Having trouble? Contact our support team at 
                <a href="mailto:hello@consultitude.com" style="color: #667eea;">support@consultitude.com</a>
            </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p><strong>Consultitude</strong></p>
            <p>123 Business Street, City, State 12345</p>
            <p>© 2025 Your Company. All rights reserved.</p>
            
            <div class="social-links">
                <a href="http://13.51.183.148/privacy-and-policy">Privacy Policy</a> | 
                <a href="http://13.51.183.148/terms-and-conditions">Terms of Service</a> | 
                <a href="http://13.51.183.148/cookie-policy">Cookies</a>
            </div>
        </div>
    </div>
</body>
</html>
