// src/services/pdfGenerator.ts
import { groqService } from './groqService';

interface PDFData {
  activityType: string;
  activityName: string;
  requestDate: string;
  requesterName: string;
  requesterEmail: string;
  faculty: string;
  summary: string;
  conversationId: string;
}

class PDFGenerator {
  
  // Generar datos estructurados de la conversación
  async extractDataForPDF(): Promise<PDFData> {
    try {
      // Usar Groq para extraer datos estructurados para el PDF
      const conversation = groqService.getConversationHistory();
      
      const extractionPrompt = `Analiza esta conversación y extrae la información clave para crear un PDF de solicitud de servicios de MediaLab.

Responde ÚNICAMENTE en formato JSON con esta estructura:
{
  "activityType": "tipo de actividad detectado",
  "activityName": "nombre del evento/actividad",
  "requestDate": "fecha actual en formato DD/MM/YYYY",
  "requesterName": "nombre del solicitante",
  "requesterEmail": "email del solicitante", 
  "faculty": "facultad o departamento",
  "summary": "resumen completo de todos los servicios solicitados",
  "additionalInfo": "información adicional relevante"
}

Si algún dato no está disponible, usa "No especificado".`;

      // Solo hacer la llamada si hay una conversación real
      if (conversation.length > 2) {
        const completion = await groqService.sendMessage(extractionPrompt);
        
        try {
          // Intentar parsear la respuesta JSON
          const cleanJson = completion.replace(/```json|```/g, '').trim();
          const extracted = JSON.parse(cleanJson);
          
          return {
            activityType: extracted.activityType || 'Solicitud de servicios',
            activityName: extracted.activityName || 'Actividad sin nombre',
            requestDate: new Date().toLocaleDateString('es-GT'),
            requesterName: extracted.requesterName || 'No especificado',
            requesterEmail: extracted.requesterEmail || 'No especificado',
            faculty: extracted.faculty || 'No especificado',
            summary: extracted.summary || 'No se pudo generar resumen',
            conversationId: `ML-${Date.now()}`
          };
        } catch (parseError) {
          console.error('Error parsing PDF data:', parseError);
          return this.getFallbackPDFData();
        }
      } else {
        return this.getFallbackPDFData();
      }
      
    } catch (error) {
      console.error('Error extracting PDF data:', error);
      return this.getFallbackPDFData();
    }
  }

  // Datos de fallback si no se puede extraer
  private getFallbackPDFData(): PDFData {
    return {
      activityType: 'Solicitud de servicios',
      activityName: 'Actividad solicitada',
      requestDate: new Date().toLocaleDateString('es-GT'),
      requesterName: 'No especificado',
      requesterEmail: 'No especificado', 
      faculty: 'No especificado',
      summary: 'Favor contactar para más detalles sobre la solicitud.',
      conversationId: `ML-${Date.now()}`
    };
  }

  // Generar HTML para el PDF
  private generateHTMLContent(data: PDFData): string {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Solicitud de Servicios - MediaLab</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 40px 20px;
                background: #fff;
            }
            
            .header {
                text-align: center;
                margin-bottom: 40px;
                border-bottom: 3px solid #2563eb;
                padding-bottom: 20px;
            }
            
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #2563eb;
                margin-bottom: 10px;
            }
            
            .subtitle {
                color: #666;
                font-size: 16px;
            }
            
            .section {
                margin-bottom: 30px;
                background: #f8fafc;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #2563eb;
            }
            
            .section-title {
                font-size: 18px;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 15px;
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 20px;
            }
            
            @media (max-width: 600px) {
                .info-grid {
                    grid-template-columns: 1fr;
                }
            }
            
            .info-item {
                margin-bottom: 10px;
            }
            
            .info-label {
                font-weight: bold;
                color: #374151;
                margin-bottom: 5px;
            }
            
            .info-value {
                color: #6b7280;
                padding: 8px 12px;
                background: white;
                border-radius: 4px;
                border: 1px solid #e5e7eb;
            }
            
            .summary {
                background: white;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
                white-space: pre-wrap;
                line-height: 1.8;
            }
            
            .footer {
                margin-top: 40px;
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 14px;
            }
            
            .conversation-id {
                background: #1f2937;
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-family: monospace;
                font-size: 12px;
                display: inline-block;
                margin-top: 10px;
            }
            
            @media print {
                body { padding: 20px; }
                .section { break-inside: avoid; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">📺 MediaLab</div>
            <div class="subtitle">Unidad de Producción Audiovisual</div>
            <div class="subtitle">Solicitud de Servicios</div>
        </div>

        <div class="section">
            <div class="section-title">📋 Información General</div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Tipo de Actividad:</div>
                    <div class="info-value">${data.activityType}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Nombre del Evento:</div>
                    <div class="info-value">${data.activityName}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Fecha de Solicitud:</div>
                    <div class="info-value">${data.requestDate}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Facultad/Departamento:</div>
                    <div class="info-value">${data.faculty}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">👤 Datos del Solicitante</div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Nombre:</div>
                    <div class="info-value">${data.requesterName}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Correo Electrónico:</div>
                    <div class="info-value">${data.requesterEmail}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">📝 Resumen de Servicios Solicitados</div>
            <div class="summary">${data.summary}</div>
        </div>

        <div class="footer">
            <p>Este documento fue generado automáticamente por el Asistente Virtual de MediaLab</p>
            <p>Para seguimiento, contacte a MediaLab con el siguiente ID:</p>
            <div class="conversation-id">${data.conversationId}</div>
            <p style="margin-top: 20px;">
                📞 Contacto: medialab@universidad.edu | 📱 WhatsApp: +502 1234-5678
            </p>
        </div>
    </body>
    </html>`;
  }

  // Generar y descargar PDF
  async generateAndDownloadPDF(): Promise<void> {
    try {
      console.log('🔄 Generando PDF...');
      
      // Extraer datos para el PDF
      const pdfData = await this.extractDataForPDF();
      
      // Generar HTML
      const htmlContent = this.generateHTMLContent(pdfData);
      
      // Crear blob con el HTML
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Crear enlace de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `MediaLab_Solicitud_${pdfData.conversationId}.html`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      URL.revokeObjectURL(url);
      
      console.log('✅ PDF generado y descargado:', pdfData.conversationId);
      
      // También abrir en nueva ventana para imprimir como PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Auto-trigger print dialog después de un pequeño delay
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      }
      
    } catch (error) {
      console.error('❌ Error generando PDF:', error);
      throw new Error('No se pudo generar el PDF. Intenta de nuevo.');
    }
  }

  // Verificar si se puede generar PDF
  canGeneratePDF(): boolean {
    const conversation = groqService.getConversationHistory();
    return conversation.length > 2; // Al menos 2 intercambios
  }

  // Obtener vista previa de datos
  async getPreviewData(): Promise<PDFData> {
    return await this.extractDataForPDF();
  }
}

// Singleton
export const pdfGenerator = new PDFGenerator();
export default PDFGenerator;