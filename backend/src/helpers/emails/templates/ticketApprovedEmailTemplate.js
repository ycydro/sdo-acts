import { format } from "date-fns";

const ticketApprovedEmailTemplate = ({
  customerName,
  ticketCode,
  serviceName,
  scheduledDate,
  queueLink = "http://localhost:3000/queue/",
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
                      Your ticket request has been approved.
                    </h1>
                    <p style="margin:20px 0 0; font-size:16px; line-height:1.6; color:${textColor};">
                      Hello ${customerName},
                    </p>
                    <p style="margin:8px 0 0; font-size:15px; line-height:1.6; color:#4b5563;">
                      Your ticket has been reviewed and is now officially <strong>In Queue</strong>. Please take note of your schedule and visit our office to proceed with your request.
                    </p>
                  </td>
                </tr>
              </table>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:16px; background-color:${grayBg}; border-radius:12px; border: 1px solid #e5e7eb;">
                <tr>
                  <td style="padding:24px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom:16px;">
                          <span style="font-size:11px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:0.05em;">Scheduled Visit Date</span><br/>
                          <span style="font-size:14px; font-weight:700; color:${textColor};">${format(scheduledDate, "MMMM dd, yyyy")}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:16px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">
                           <span style="font-size:11px; font-weight:700; color:#9ca3af; text-transform:uppercase;">Office Hours</span><br/>
                           <span style="font-size:14px; font-weight:600; color:${textColor};">8:00 AM - 5:00 PM</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:16px;">
                          <span style="font-size:11px; font-weight:700; color:#9ca3af; text-transform:uppercase;">Ticket Code</span><br/>
                          <span style="font-size:14px; font-weight:600; color:${textColor};">${ticketCode}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:16px;">
                <tr>
                  <td align="center">
                    <a href="${queueLink}" style="background-color:${primary}; color:#ffffff; padding: 14px 28px; text-decoration:none; border-radius:8px; font-weight:700; font-size:15px; display:inline-block;">
                      View Queue
                    </a>
                  </td>
                </tr>
              </table>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:20px; border-top:1px solid #f3f4f6; padding-top:24px;">
                <tr>
                  <td style="font-size:13px; color:#6b7280; line-height:1.6;">
                    Best regards,<br/>
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

export default ticketApprovedEmailTemplate;
