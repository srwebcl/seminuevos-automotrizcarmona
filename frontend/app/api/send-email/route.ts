import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, data, vehicle } = body;

        let to: string[] = [];
        let cc: string[] = [];
        let subject = '';
        let internalHtml = '';
        let clientHtml = '';
        let clientSubject = '';

        // --- 1. CONFIGURACIÓN DE DESTINATARIOS Y ASUNTOS ---

        if (type === 'evaluation') {
            subject = `🚗 Nueva Solicitud de Evaluación: ${data.name} - ${vehicle?.brand?.name} ${vehicle?.model}`;

            // Lógica Premium
            if (vehicle?.is_premium) {
                to = ['crivera@carmonaycia.cl'];
                cc = ['nmercado@carmonaycia.cl', 'frios@carmonaycia.cl', 'contacto@srweb.cl'];
            } else {
                to = ['mfarias@carmonaycia.cl'];
                cc = ['contacto@srweb.cl']; // Copia de verificación
            }

        } else if (type === 'financing') {
            subject = `💰 Nueva Solicitud de Financiamiento: ${data.name}`;
            to = ['nmercado@carmonaycia.cl'];
            cc = ['frios@carmonaycia.cl', 'mfarias@carmonaycia.cl', 'contacto@srweb.cl'];

        } else if (type === 'sell') {
            subject = `💵 Nuevo Lead "Parte de Pago": ${data.brand} ${data.model} (${data.year})`;
            to = ['mfarias@carmonaycia.cl'];
            cc = ['frios@carmonaycia.cl', 'contacto@srweb.cl'];
        }

        // --- 2. PLANTILLAS HTML (INLINE PARA COMPATIBILIDAD) ---

        // Plantilla Interna (Tabla de Datos)
        internalHtml = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #000; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">${subject}</h2>
            
            ${vehicle ? `
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin-top: 0;">Vehículo de Interés</h3>
                <p><strong>Auto:</strong> ${vehicle.brand.name} ${vehicle.model} (${vehicle.year})</p>
                <p><strong>Precio:</strong> ${vehicle.price_formatted}</p>
                <p><strong>SKU/ID:</strong> #${vehicle.id}</p>
                ${vehicle.is_premium ? '<p style="color: #D4AF37; font-weight: bold;">⭐ VEHÍCULO PREMIUM</p>' : ''}
            </div>
            ` : ''}

            <h3>Datos del Cliente</h3>
            <table style="width: 100%; border-collapse: collapse;">
                ${Object.entries(data).map(([key, value]) => `
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%; text-transform: capitalize;">${key.replace(/_/g, ' ')}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">${value}</td>
                </tr>
                `).join('')}
            </table>
            
            <p style="margin-top: 20px; color: #666; font-size: 12px;">Lead generado desde el sitio web Automotriz Carmona.</p>
        </div>
        `;

        // Plantilla Cliente (Premium Response)
        clientSubject = type === 'sell'
            ? 'Recibimos los datos de tu auto - Automotriz Carmona'
            : 'Hemos recibido tu solicitud - Automotriz Carmona';

        clientHtml = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000000; color: #ffffff;">
            <!-- Header -->
            <div style="padding: 30px; text-align: center; border-bottom: 1px solid #333;">
                <h1 style="color: #D4AF37; margin: 0; font-size: 24px; letter-spacing: 1px;">AUTOMOTRIZ CARMONA</h1>
            </div>

            <!-- Body -->
            <div style="padding: 40px 30px; background-color: #111111;">
                <h2 style="color: #ffffff; margin-top: 0;">Hola, ${data.name.split(' ')[0]}</h2>
                <p style="color: #cccccc; line-height: 1.6;">
                    Hemos recibido tu solicitud correctamente. Nuestro equipo comercial ya está revisando tus antecedentes y se pondrá en contacto contigo a la brevedad posible.
                </p>

                <div style="margin: 30px 0; padding: 20px; border-left: 4px solid #D4AF37; background-color: #1a1a1a;">
                    <p style="margin: 0; color: #D4AF37; font-weight: bold;">Compromiso de Calidad</p>
                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #999;">
                        En Automotriz Carmona nos caracterizamos por una atención personalizada y transparente. Estás en buenas manos.
                    </p>
                </div>

                <p style="color: #cccccc;">Si tienes dudas urgentes, puedes escribirnos directamente respondiendo a este correo.</p>
            </div>

            <!-- Footer -->
            <div style="padding: 20px; text-align: center; font-size: 12px; color: #666666; background-color: #000000;">
                <p>&copy; ${new Date().getFullYear()} Automotriz Carmona. Todos los derechos reservados.</p>
                <p>Av. Balmaceda 3570, La Serena, Chile.</p>
            </div>
        </div>
        `;

        // --- 3. ENVÍO DE CORREOS ---

        // A) Correo Interno
        await resend.emails.send({
            from: 'Automotriz Carmona <marketing@carmonaycia.cl>', // Debe actualizarse a un dominio verificado en prod
            to: to,
            cc: cc,
            replyTo: data.email,
            subject: subject,
            html: internalHtml,
        });

        // B) Correo al Cliente (Auto-reply)
        if (data.email) {
            await resend.emails.send({
                from: 'Automotriz Carmona <marketing@carmonaycia.cl>',
                to: [data.email],
                subject: clientSubject,
                html: clientHtml,
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Email error:', error);
        return NextResponse.json({ error: 'Error processing email' }, { status: 500 });
    }
}
