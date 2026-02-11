import { format } from "date-fns";

const ticketResolvedEmailTemplate = ({
  customerName,
  ticketCode,
  serviceName,
  completionDate = new Date(),
  surveyLink = "",
}) => {
  const primary = "#006b44";
  const success = "#10b981";
  const grayBg = "#f9fafb";
  const textColor = "#1f2937";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6; font-family: 'Inter', -apple-system, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          
          <tr>
            <td style="background-color:${success}; height:6px;"></td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <h1 style="margin:0; font-size:22px; color:${primary}; font-weight:800; letter-spacing:-0.01em;">
                      Your ticket request has been resolved.
                    </h1>
                    <p style="margin:20px 0 0; font-size:16px; line-height:1.6; color:${textColor};">
                      Hello ${customerName},
                    </p>
                    <p style="margin:8px 0 0; font-size:15px; line-height:1.6; color:#4b5563;">
                      We are pleased to inform you that your request for <strong>${serviceName}</strong> has been successfully processed and marked as resolved.
                    </p>
                    <p style="margin:16px 0 0; font-size:15px; line-height:1.6; color:#4b5563;">
                      Please take a moment to complete our brief satisfaction survey to help us maintain and improve our services.
                    </p>
                  </td>
                </tr>
              </table>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:24px; background-color:${grayBg}; border-radius:12px; border: 1px solid #e5e7eb;">
                <tr>
                  <td style="padding:24px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom:16px;">
                          <span style="font-size:11px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:0.05em;">Date Completed</span><br/>
                          <span style="font-size:14px; font-weight:700; color:${textColor};">${format(completionDate, "MMMM dd, yyyy")}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:16px; border-top: 1px solid #e5e7eb;">
                          <span style="font-size:11px; font-weight:700; color:#9ca3af; text-transform:uppercase;">Ticket Code</span><br/>
                          <span style="font-size:14px; font-weight:600; color:${textColor};">${ticketCode}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:24px;">
                <tr>
                  <td align="center">
                    <a href="${surveyLink}" style="background-color:${primary}; color:#ffffff; padding: 14px 28px; text-decoration:none; border-radius:8px; font-weight:700; font-size:15px; display:inline-block;">
                      Share Your Feedback
                    </a>
                  </td>
                </tr>
              </table>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:32px; border-top:1px solid #f3f4f6; padding-top:24px;">
                <tr>
                  <td style="font-size:13px; color:#6b7280; line-height:1.6;">
                    Best Regards,<br/>
                    <strong style="color:${primary};">SDO Meycauayan Support Team</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

export default ticketResolvedEmailTemplate;
