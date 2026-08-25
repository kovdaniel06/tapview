import * as React from 'react';

interface AdminMessageEmailProps {
  customerName: string;
  orderNumber?: number | string;
  message: string;
}

export const AdminMessageEmail: React.FC<AdminMessageEmailProps> = ({
  customerName,
  orderNumber,
  message,
}) => (
  <html>
    <head>
      <meta name="color-scheme" content="dark" />
      <meta name="supported-color-schemes" content="dark" />
    </head>
    <body style={{ margin: 0, padding: 0, backgroundColor: '#050816' }}>
      <table
        role="presentation"
        width="100%"
        cellPadding={0}
        cellSpacing={0}
        style={{ backgroundColor: '#050816', padding: '40px 12px' }}
      >
        <tr>
          <td align="center">
            <table
              role="presentation"
              width="100%"
              cellPadding={0}
              cellSpacing={0}
              style={{
                maxWidth: '580px',
                backgroundColor: '#0B0F24',
                border: '1px solid #1f2937',
                borderRadius: '20px',
                overflow: 'hidden',
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              }}
            >
              {/* Fejléc / Logó */}
              <tr>
                <td
                  align="center"
                  style={{ padding: '32px 32px 24px 32px', borderBottom: '1px solid #1f2937' }}
                >
                  <table role="presentation" cellPadding={0} cellSpacing={0}>
                    <tr>
                      <td
                        style={{
                          backgroundColor: '#4285F4',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '16px',
                          padding: '8px 12px',
                          borderRadius: '10px',
                        }}
                      >
                        T
                      </td>
                      <td style={{ width: '10px' }} />
                      <td
                        style={{
                          fontSize: '20px',
                          fontWeight: 800,
                          letterSpacing: '1px',
                          color: '#ffffff',
                          textTransform: 'uppercase',
                        }}
                      >
                        TAP<span style={{ color: '#4285F4' }}>VIEW</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              {/* Tartalom */}
              <tr>
                <td style={{ padding: '32px' }}>
                  <table role="presentation" cellPadding={0} cellSpacing={0}>
                    <tr>
                      <td
                        style={{
                          backgroundColor: 'rgba(66, 133, 244, 0.12)',
                          border: '1px solid rgba(66, 133, 244, 0.3)',
                          borderRadius: '20px',
                          padding: '6px 14px',
                          fontSize: '12px',
                          color: '#7BAAF7',
                          fontWeight: 700,
                        }}
                      >
                        ÜZENET AZ ÜGYFÉLSZOLGÁLATTÓL
                      </td>
                    </tr>
                  </table>

                  <h1
                    style={{
                      color: '#ffffff',
                      fontSize: '20px',
                      fontWeight: 700,
                      margin: '20px 0 6px 0',
                    }}
                  >
                    Kedves {customerName}!
                  </h1>

                  {orderNumber && (
                    <p style={{ color: '#7BAAF7', fontSize: '13px', fontFamily: 'monospace', margin: '0 0 20px 0' }}>
                      Kapcsolódó rendelés: #ORD-{orderNumber}
                    </p>
                  )}

                  {/* Az üzenet szövege — soronként külön bekezdésbe törve */}
                  <div style={{ color: '#d1d5db', fontSize: '14px', lineHeight: '1.7' }}>
                    {message.split('\n').map((line, i) => (
                      <p key={i} style={{ margin: '0 0 12px 0' }}>
                        {line || '\u00A0'}
                      </p>
                    ))}
                  </div>
                </td>
              </tr>

              {/* Footer */}
              <tr>
                <td style={{ padding: '20px 32px 32px 32px', borderTop: '1px solid #1f2937' }}>
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      textAlign: 'center',
                      margin: 0,
                      lineHeight: '1.6',
                    }}
                  >
                    Tapview Hungary
                    <br />
                    Kérdés esetén válaszolj erre az e-mailre, vagy írj nekünk az{' '}
                    <a href="mailto:info@tapview.hu" style={{ color: '#7BAAF7', textDecoration: 'none' }}>
                      info@tapview.hu
                    </a>{' '}
                    címen.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
);