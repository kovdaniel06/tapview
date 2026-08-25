import * as React from 'react';

interface OrderConfirmationEmailProps {
  customerName: string;
  orderNumber: number | string;
  totalAmount: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  shippingMethod?: string;
  shippingAddress?: string;
  pickupPointName?: string;
  pickupPointAddress?: string;
  orderUrl?: string;
}

export const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  customerName,
  orderNumber,
  totalAmount,
  items,
  shippingMethod,
  shippingAddress,
  pickupPointName,
  pickupPointAddress,
  orderUrl,
}) => {
  const isPickup = (shippingMethod === 'pickup' || shippingMethod === 'packeta') && pickupPointName;

  return (
    <html>
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#050816' }}>
        <div style={{ display: 'none', maxHeight: 0, overflow: 'hidden', opacity: 0 }}>
          Köszönjük a rendelésed, {customerName}! A #{orderNumber} rendelésed összege {totalAmount.toLocaleString('hu-HU')} Ft.
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
                                backgroundColor: 'rgba(66, 133, 244, 0.12)',
                                border: '1px solid rgba(66, 133, 244, 0.3)',
                                borderRadius: '20px',
                                padding: '6px 14px',
                                fontSize: '12px',
                                color: '#7BAAF7',
                                fontWeight: 700,
                              }}
                            >
                              ✓ SIKERES MEGRENDELÉS
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
                        Köszönjük a rendelést, {customerName}! 🎉
                      </h1>
                      <p
                        style={{
                          color: '#9ca3af',
                          fontSize: '14px',
                          lineHeight: '1.65',
                          margin: '0 0 24px 0',
                        }}
                      >
                        A megrendelésedet sikeresen rögzítettük. Amint összekészítjük és
                        átadjuk a futárnak, egy újabb e-mailben értesítünk a nyomkövetési
                        adatokkal együtt.
                      </p>

                      {/* Rendelésszám */}
                      <table
                        role="presentation"
                        width="100%"
                        cellPadding={0}
                        cellSpacing={0}
                        style={{
                          backgroundColor: '#151b30',
                          borderRadius: '14px',
                          border: '1px solid #1f2937',
                          marginBottom: '24px',
                        }}
                      >
                        <tbody>
                          <tr>
                            <td style={{ padding: '16px 20px' }}>
                              <span style={{ color: '#9ca3af', fontSize: '13px' }}>
                                Rendelés azonosító
                              </span>
                              <div
                                style={{
                                  color: '#ffffff',
                                  fontSize: '16px',
                                  fontWeight: 700,
                                  fontFamily: 'monospace',
                                  marginTop: '2px',
                                }}
                              >
                                #ORD-{orderNumber}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Tételek */}
                      <h3
                        style={{
                          color: '#ffffff',
                          fontSize: '15px',
                          fontWeight: 700,
                          margin: '0 0 12px 0',
                        }}
                      >
                        Rendelt tételek
                      </h3>
                      <table
                        role="presentation"
                        width="100%"
                        cellPadding={0}
                        cellSpacing={0}
                        style={{ marginBottom: '20px' }}
                      >
                        <tbody>
                          {items.map((item, index) => (
                            <tr key={index}>
                              <td
                                style={{
                                  padding: '12px 0',
                                  borderBottom: '1px solid #1f2937',
                                }}
                              >
                                <div
                                  style={{
                                    color: '#ffffff',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                  }}
                                >
                                  {item.name}
                                </div>
                                <div
                                  style={{
                                    color: '#9ca3af',
                                    fontSize: '12px',
                                    marginTop: '2px',
                                  }}
                                >
                                  {item.quantity} db × {item.price.toLocaleString('hu-HU')} Ft
                                </div>
                              </td>
                              <td
                                align="right"
                                style={{
                                  padding: '12px 0',
                                  borderBottom: '1px solid #1f2937',
                                  color: '#ffffff',
                                  fontWeight: 700,
                                  fontSize: '14px',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {(item.quantity * item.price).toLocaleString('hu-HU')} Ft
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Összeg */}
                      <table
                        role="presentation"
                        width="100%"
                        cellPadding={0}
                        cellSpacing={0}
                        style={{
                          borderTop: '2px solid #374151',
                          paddingTop: '16px',
                          marginBottom: '24px',
                        }}
                      >
                        <tbody>
                          <tr>
                            <td align="right" style={{ paddingTop: '16px' }}>
                              <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: 700 }}>
                                Összesen:{' '}
                              </span>
                              <span style={{ color: '#4285F4', fontSize: '22px', fontWeight: 800 }}>
                                {totalAmount.toLocaleString('hu-HU')} Ft
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Szállítási blokk */}
                      {(isPickup || shippingAddress) && (
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
                              <td style={{ padding: '16px 20px' }}>
                                <span
                                  style={{
                                    color: '#9ca3af',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                  }}
                                >
                                  Szállítási mód
                                </span>
                                <div
                                  style={{
                                    color: '#34d399',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    marginTop: '6px',
                                  }}
                                >
                                  {isPickup ? 'Csomagautomata / Átvételi pont' : 'GLS Házhozszállítás'}
                                </div>
                                <div
                                  style={{
                                    color: '#ffffff',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    marginTop: '4px',
                                  }}
                                >
                                  {isPickup ? pickupPointName : shippingAddress}
                                </div>
                                {isPickup && pickupPointAddress && (
                                  <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '2px' }}>
                                    {pickupPointAddress}
                                  </div>
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      )}

                      {/* CTA */}
                      {orderUrl && (
                        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
                          <tbody>
                            <tr>
                              <td align="center">
                                <a
                                  href={orderUrl}
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
                                  Rendelés megtekintése →
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      )}
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