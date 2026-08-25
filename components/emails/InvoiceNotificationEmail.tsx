import * as React from 'react';

interface InvoiceNotificationEmailProps {
  customerName: string;
  orderNumber: number | string;
  invoiceNumber: string;
  invoiceUrl: string;
  totalAmount: number;
}

export const InvoiceNotificationEmail: React.FC<InvoiceNotificationEmailProps> = ({
  customerName,
  orderNumber,
  invoiceNumber,
  invoiceUrl,
  totalAmount,
}) => {
  return (
    <html>
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#050816' }}>
        <div style={{ display: 'none', maxHeight: 0, overflow: 'hidden', opacity: 0 }}>
          Elkészült a #ORD-{orderNumber} rendelésedhez tartozó számla ({invoiceNumber}).
        </div>

        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ backgroundColor: '#050816', padding: '40px 12px' }}
        >
          <tbody>
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
                  {/* Fejléc */}
                  <tr>
                    <td
                      align="center"
                      style={{
                        padding: '32px 32px 24px 32px',
                        borderBottom: '1px solid #1f2937',
                      }}
                    >
                      <table role="presentation" cellPadding={0} cellSpacing={0}>
                        <tbody>
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
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  {/* Tartalom */}
                  <tr>
                    <td style={{ padding: '32px' }}>
                      <table role="presentation" cellPadding={0} cellSpacing={0}>
                        <tbody>
                          <tr>
                            <td
                              style={{
                                backgroundColor: 'rgba(52, 211, 153, 0.12)',
                                border: '1px solid rgba(52, 211, 153, 0.3)',
                                borderRadius: '20px',
                                padding: '6px 14px',
                                fontSize: '12px',
                                color: '#34d399',
                                fontWeight: 700,
                              }}
                            >
                              ✓ SZÁMLA ELKÉSZÜLT
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <h1
                        style={{
                          color: '#ffffff',
                          fontSize: '22px',
                          fontWeight: 700,
                          margin: '20px 0 10px 0',
                        }}
                      >
                        Kedves {customerName}! 📄
                      </h1>
                      <p
                        style={{
                          color: '#9ca3af',
                          fontSize: '14px',
                          lineHeight: '1.65',
                          margin: '0 0 24px 0',
                        }}
                      >
                        A #ORD-{orderNumber} számú megrendelésedhez tartozó elektronikus számládat kiállítottuk. Az alábbi gombra kattintva bármikor letöltheted PDF formátumban.
                      </p>

                      {/* Számla adatok kártya */}
                      <table
                        role="presentation"
                        width="100%"
                        cellPadding={0}
                        cellSpacing={0}
                        style={{
                          backgroundColor: '#151b30',
                          borderRadius: '14px',
                          border: '1px solid #1f2937',
                          marginBottom: '28px',
                        }}
                      >
                        <tbody>
                          <tr>
                            <td style={{ padding: '16px 20px', borderBottom: '1px solid #1f2937' }}>
                              <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                                Számlaszám
                              </span>
                              <div
                                style={{
                                  color: '#ffffff',
                                  fontSize: '15px',
                                  fontWeight: 700,
                                  fontFamily: 'monospace',
                                  marginTop: '2px',
                                }}
                              >
                                {invoiceNumber}
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: '16px 20px' }}>
                              <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                                Végösszeg
                              </span>
                              <div
                                style={{
                                  color: '#4285F4',
                                  fontSize: '18px',
                                  fontWeight: 800,
                                  marginTop: '2px',
                                }}
                              >
                                {totalAmount.toLocaleString('hu-HU')} Ft
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* CTA Gomb */}
                      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
                        <tbody>
                          <tr>
                            <td align="center">
                              <a
                                href={invoiceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-block',
                                  backgroundColor: '#4285F4',
                                  color: '#ffffff',
                                  fontSize: '14px',
                                  fontWeight: 700,
                                  textDecoration: 'none',
                                  padding: '14px 32px',
                                  borderRadius: '999px',
                                }}
                              >
                                Számla letöltése (PDF) →
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  {/* Footer */}
                  <tr>
                    <td
                      style={{
                        padding: '20px 32px 32px 32px',
                        borderTop: '1px solid #1f2937',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          textAlign: 'center',
                          margin: 0,
                          lineHeight: '1.6',
                        }}
                      >
                        Tapview Hungary • Ez egy automatikus értesítő e-mail.
                        <br />
                        Kérdés esetén írj nekünk az{' '}
                        <a
                          href="mailto:info@tapview.hu"
                          style={{ color: '#7BAAF7', textDecoration: 'none' }}
                        >
                          info@tapview.hu
                        </a>{' '}
                        címen.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
};