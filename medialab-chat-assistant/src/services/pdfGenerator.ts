// src/services/pdfGenerator.ts
import { groqService, type ExtractedActivityData } from './groqService';

class PDFGenerator {
  
  // Generar datos estructurados de la conversación
  async extractDataForPDF(): Promise<ExtractedActivityData | null> {
    try {
      console.log('🔄 Extrayendo datos estructurados para PDF...');
      
      // Usar el nuevo método de extracción granular
      const structuredData = await groqService.extractStructuredData();
      
      if (!structuredData) {
        console.warn('⚠️ No se pudieron extraer datos estructurados');
        return null;
      }
      
      console.log('✅ Datos estructurados extraídos:', structuredData);
      return structuredData;
      
    } catch (error) {
      console.error('❌ Error extrayendo datos para PDF:', error);
      return null;
    }
  }

  // Generar HTML optimizado para impresión profesional
  private generateHTMLContent(data: ExtractedActivityData): string {
    // Header común para todos los tipos
    const commonHeader = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Solicitud de Servicios - MediaLab</title>
        <style>
            /* Reset y configuración base */
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            @page {
                size: A4;
                margin: 20mm;
            }
            
            body {
                font-family: 'Arial', 'Helvetica', sans-serif;
                line-height: 1.4;
                color: #1a1a1a;
                font-size: 12px;
                background: white;
            }
            
            /* Layout principal */
            .container {
                max-width: 100%;
                margin: 0 auto;
            }
            
            /* Header institucional */
            .header {
                text-align: center;
                margin-bottom: 25px;
                padding-bottom: 15px;
                border-bottom: 2px solid #2563eb;
            }
            
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #2563eb;
                margin-bottom: 5px;
            }
            
            .subtitle {
                color: #4b5563;
                font-size: 14px;
                margin-bottom: 3px;
            }
            
            .form-title {
                color: #1f2937;
                font-size: 16px;
                font-weight: bold;
                margin-top: 8px;
            }
            
            /* Secciones */
            .section {
                margin-bottom: 20px;
                break-inside: avoid;
            }
            
            .section-title {
                font-size: 14px;
                font-weight: bold;
                color: #1e40af;
                margin-bottom: 12px;
                padding: 6px 0;
                border-bottom: 1px solid #e5e7eb;
            }
            
            /* Grid de información */
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 15px;
            }
            
            .info-grid.single-col {
                grid-template-columns: 1fr;
            }
            
            .info-item {
                margin-bottom: 8px;
            }
            
            .info-label {
                font-weight: bold;
                color: #374151;
                font-size: 11px;
                margin-bottom: 2px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .info-value {
                color: #1f2937;
                font-size: 12px;
                padding: 4px 8px;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 3px;
                min-height: 20px;
            }
            
            .info-value.large {
                min-height: 40px;
                padding: 8px;
            }
            
            /* Tablas para listas estructuradas */
            .data-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 15px;
                font-size: 11px;
            }
            
            .data-table th {
                background: #f3f4f6;
                color: #374151;
                font-weight: bold;
                padding: 6px 8px;
                border: 1px solid #d1d5db;
                text-align: left;
            }
            
            .data-table td {
                padding: 6px 8px;
                border: 1px solid #e5e7eb;
                vertical-align: top;
            }
            
            .data-table tr:nth-child(even) {
                background: #f9fafb;
            }
            
            /* Listas de elementos */
            .item-list {
                list-style: none;
                padding: 0;
            }
            
            .item-list li {
                padding: 4px 8px;
                margin-bottom: 3px;
                background: #f9fafb;
                border: 1px solid #e5e7eb;
                border-radius: 3px;
                font-size: 11px;
            }
            
            .item-list li strong {
                color: #1f2937;
            }
            
            /* Patrones de recurrencia */
            .recurrence-pattern {
                background: #eff6ff;
                border: 1px solid #bfdbfe;
                border-radius: 4px;
                padding: 8px;
                margin: 8px 0;
                font-size: 11px;
                color: #1e40af;
            }
            
            /* Footer */
            .footer {
                margin-top: 30px;
                padding-top: 15px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                font-size: 10px;
                color: #6b7280;
                break-inside: avoid;
            }
            
            .request-id {
                background: #1f2937;
                color: white;
                padding: 4px 12px;
                border-radius: 12px;
                font-family: 'Courier New', monospace;
                font-size: 10px;
                display: inline-block;
                margin: 8px 0;
            }
            
            /* Utilidades de impresión */
            @media print {
                body { 
                    print-color-adjust: exact;
                    -webkit-print-color-adjust: exact;
                }
                .section { 
                    break-inside: avoid;
                    page-break-inside: avoid;
                }
                .header {
                    page-break-after: avoid;
                }
            }
            
            /* Colores de tipo de actividad */
            .activity-single { border-left: 4px solid #10b981; }
            .activity-recurrent { border-left: 4px solid #f59e0b; }
            .activity-podcast { border-left: 4px solid #8b5cf6; }
            .activity-course { border-left: 4px solid #ef4444; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">📺 MediaLab</div>
                <div class="subtitle">Unidad de Producción Audiovisual</div>
                <div class="subtitle">Universidad Mariano Gálvez</div>
                <div class="form-title">SOLICITUD OFICIAL DE SERVICIOS</div>
            </div>`;

    // Generar contenido específico según el tipo de actividad
    let specificContent = '';
    
    switch (data.type) {
      case 'single':
        specificContent = this.generateSingleActivityContent(data);
        break;
      case 'recurrent':
        specificContent = this.generateRecurrentActivityContent(data);
        break;
      case 'podcast':
        specificContent = this.generatePodcastContent(data);
        break;
      case 'course':
        specificContent = this.generateCourseContent(data);
        break;
      default:
        specificContent = '<div class="section"><p>Tipo de actividad no reconocido</p></div>';
    }

    // Footer común
    const footer = `
            <div class="footer">
                <p><strong>MediaLab - Unidad de Producción Audiovisual</strong></p>
                <p>Este documento fue generado automáticamente por el Asistente Virtual</p>
                <div class="request-id">ID: ML-${Date.now()}</div>
                <p style="margin-top: 10px;">
                    📞 Contacto: medialab@umg.edu.gt | 📱 WhatsApp: +502 2423-8000
                </p>
                <p style="margin-top: 5px; font-size: 9px;">
                    Fecha de generación: ${new Date().toLocaleDateString('es-GT', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                </p>
            </div>
        </div>
    </body>
    </html>`;

    return commonHeader + specificContent + footer;
  }

  // Generar contenido para actividad única
  private generateSingleActivityContent(data: any): string {
    return `
            <div class="section activity-single">
                <div class="section-title">📋 ACTIVIDAD ÚNICA</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Nombre de la Actividad</div>
                        <div class="info-value">${data.activityName || 'No especificado'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Facultad Responsable</div>
                        <div class="info-value">${data.faculty || 'No especificado'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Fecha del Evento</div>
                        <div class="info-value">${data.date || 'No especificado'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Horario</div>
                        <div class="info-value">${data.startTime || 'No especificado'} - ${data.endTime || 'No especificado'}</div>
                    </div>
                </div>
                
                ${this.generateLocationSection(data.location)}
                
                <div class="info-grid single-col">
                    <div class="info-item">
                        <div class="info-label">Descripción de la Actividad</div>
                        <div class="info-value large">${data.description || 'No especificado'}</div>
                    </div>
                </div>
            </div>
            
            ${this.generateServicesSection(data.services)}
            ${this.generateRequesterSection(data.requester)}`;
  }

  // Generar contenido para actividad recurrente
  private generateRecurrentActivityContent(data: any): string {
    return `
            <div class="section activity-recurrent">
                <div class="section-title">🔄 ACTIVIDAD RECURRENTE</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Nombre de la Actividad</div>
                        <div class="info-value">${data.activityName || 'No especificado'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Facultad Responsable</div>
                        <div class="info-value">${data.faculty || 'No especificado'}</div>
                    </div>
                </div>
                
                ${this.generateRecurrenceSection(data.recurrence)}
                ${this.generateLocationSection(data.location)}
                
                <div class="info-grid single-col">
                    <div class="info-item">
                        <div class="info-label">Descripción de la Actividad</div>
                        <div class="info-value large">${data.description || 'No especificado'}</div>
                    </div>
                </div>
            </div>
            
            ${this.generateServicesSection(data.services)}
            ${this.generateRequesterSection(data.requester)}`;
  }

  // Generar contenido para podcast
  private generatePodcastContent(data: any): string {
    return `
            <div class="section activity-podcast">
                <div class="section-title">🎙️ PODCAST</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Nombre del Podcast</div>
                        <div class="info-value">${data.podcastName || 'No especificado'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Facultad Principal</div>
                        <div class="info-value">${data.faculty || 'No especificado'}</div>
                    </div>
                </div>
                
                <div class="info-grid single-col">
                    <div class="info-item">
                        <div class="info-label">Descripción del Podcast</div>
                        <div class="info-value large">${data.description || 'No especificado'}</div>
                    </div>
                </div>
                
                ${this.generateRecurrenceSection(data.recurrence)}
                ${this.generateLocationSection(data.location)}
                ${this.generateModeratorsSection(data.moderators)}
                ${this.generateEpisodesSection(data.episodes)}
            </div>
            
            ${this.generateServicesSection(data.services)}
            ${this.generateRequesterSection(data.requester)}`;
  }

  // Generar contenido para cursos
  private generateCourseContent(data: any): string {
    return `
            <div class="section activity-course">
                <div class="section-title">📚 CURSOS / CARRERA</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Nombre de la Carrera</div>
                        <div class="info-value">${data.careerName || 'No especificado'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Facultad Principal</div>
                        <div class="info-value">${data.faculty || 'No especificado'}</div>
                    </div>
                </div>
                
                <div class="info-grid single-col">
                    <div class="info-item">
                        <div class="info-label">Descripción General</div>
                        <div class="info-value large">${data.description || 'No especificado'}</div>
                    </div>
                </div>
                
                ${this.generateRecurrenceSection(data.recurrence)}
                ${this.generateLocationSection(data.location)}
                ${this.generateCoursesSection(data.courses)}
            </div>
            
            ${this.generateServicesSection(data.services)}
            ${this.generateRequesterSection(data.requester)}`;
  }

  // Generar sección de ubicación
  private generateLocationSection(location: any): string {
    if (!location) return '';
    
    let locationDetails = '';
    switch (location.type) {
      case 'university':
        locationDetails = `${location.tower || 'No especificado'}, Salón ${location.classroom || 'No especificado'}`;
        break;
      case 'external':
        locationDetails = location.externalAddress || 'No especificado';
        break;
      case 'virtual':
        locationDetails = 'Reunión virtual (enlaces serán proporcionados por MediaLab)';
        break;
      default:
        locationDetails = 'No especificado';
    }

    const locationTypeLabels = {
      'university': 'Universidad',
      'external': 'Ubicación Externa',
      'virtual': 'Virtual'
    };

    return `
                <div class="section">
                    <div class="section-title">📍 UBICACIÓN</div>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Tipo de Ubicación</div>
                            <div class="info-value">${locationTypeLabels[location.type as keyof typeof locationTypeLabels] || 'No especificado'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Detalles de Ubicación</div>
                            <div class="info-value">${locationDetails}</div>
                        </div>
                    </div>
                </div>`;
  }

  // Generar sección de recurrencia
  private generateRecurrenceSection(recurrence: any): string {
    if (!recurrence || !recurrence.isRecurrent) {
      return `
                <div class="section">
                    <div class="section-title">⏰ PROGRAMACIÓN</div>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Fecha</div>
                            <div class="info-value">${recurrence?.startDate || 'No especificado'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Horario</div>
                            <div class="info-value">${recurrence?.startTime || 'No especificado'} - ${recurrence?.endTime || 'No especificado'}</div>
                        </div>
                    </div>
                </div>`;
    }

    let patternDescription = '';
    switch (recurrence.type) {
      case 'daily':
        patternDescription = `Diario desde ${recurrence.startDate} hasta ${recurrence.endDate}`;
        break;
      case 'weekly':
        const days = recurrence.weekDays?.join(', ') || 'No especificado';
        patternDescription = `Semanal: ${days} desde ${recurrence.startDate} hasta ${recurrence.endDate}`;
        break;
      case 'monthly':
        if (recurrence.weekOfMonth) {
          const weekDays = recurrence.weekDays?.join(', ') || '';
          patternDescription = `Mensual: ${recurrence.weekOfMonth} semana, días ${weekDays}`;
        } else if (recurrence.dayOfMonth) {
          patternDescription = `Mensual: día ${recurrence.dayOfMonth} de cada mes`;
        }
        break;
      case 'manual':
        const dates = recurrence.selectedDates?.join(', ') || 'No especificado';
        patternDescription = `Fechas específicas: ${dates}`;
        break;
      default:
        patternDescription = 'Patrón no especificado';
    }

    return `
                <div class="section">
                    <div class="section-title">🔄 PROGRAMACIÓN RECURRENTE</div>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Periodo</div>
                            <div class="info-value">${recurrence.startDate || 'No especificado'} - ${recurrence.endDate || 'No especificado'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Horario Habitual</div>
                            <div class="info-value">${recurrence.startTime || 'No especificado'} - ${recurrence.endTime || 'No especificado'}</div>
                        </div>
                    </div>
                    <div class="recurrence-pattern">
                        <strong>Patrón de Recurrencia:</strong> ${patternDescription}
                    </div>
                </div>`;
  }

  // Generar sección de moderadores
  private generateModeratorsSection(moderators: any[]): string {
    if (!moderators || moderators.length === 0) {
      return `
                <div class="section">
                    <div class="section-title">👥 MODERADORES</div>
                    <p>No se han especificado moderadores</p>
                </div>`;
    }

    const moderatorRows = moderators.map(mod => `
                        <tr>
                            <td>${mod.name || 'No especificado'}</td>
                            <td>${mod.position || 'No especificado'}</td>
                            <td>${mod.role || 'No especificado'}</td>
                        </tr>`).join('');

    return `
                <div class="section">
                    <div class="section-title">👥 MODERADORES</div>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Cargo</th>
                                <th>Rol en el Podcast</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${moderatorRows}
                        </tbody>
                    </table>
                </div>`;
  }

  // Generar sección de episodios
  private generateEpisodesSection(episodes: any[]): string {
    if (!episodes || episodes.length === 0) {
      return `
                <div class="section">
                    <div class="section-title">📻 EPISODIOS</div>
                    <p>No se han especificado episodios</p>
                </div>`;
    }

    const episodeRows = episodes.map(ep => `
                        <tr>
                            <td><strong>${ep.name || 'No especificado'}</strong></td>
                            <td>${ep.topic || 'No especificado'}</td>
                            <td>${ep.faculty || 'No especificado'}</td>
                            <td>${ep.guests?.join(', ') || 'Sin invitados'}</td>
                        </tr>
                        ${ep.description ? `<tr><td colspan="4" style="font-size: 10px; color: #6b7280; background: #f9fafb;"><em>Descripción: ${ep.description}</em></td></tr>` : ''}`).join('');

    return `
                <div class="section">
                    <div class="section-title">📻 EPISODIOS PLANIFICADOS</div>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Nombre del Episodio</th>
                                <th>Tema Principal</th>
                                <th>Facultad</th>
                                <th>Invitados</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${episodeRows}
                        </tbody>
                    </table>
                </div>`;
  }

  // Generar sección de cursos
  private generateCoursesSection(courses: any[]): string {
    if (!courses || courses.length === 0) {
      return `
                <div class="section">
                    <div class="section-title">📖 CURSOS</div>
                    <p>No se han especificado cursos</p>
                </div>`;
    }

    const courseRows = courses.map(course => `
                        <tr>
                            <td><strong>${course.name || 'No especificado'}</strong></td>
                            <td>${course.professor || 'No especificado'}</td>
                            <td>${course.faculty || 'No especificado'}</td>
                            <td>${course.duration || 'No especificado'}</td>
                            <td>${course.recordingDates?.join(', ') || 'No especificado'}</td>
                            <td>${course.recordingTime || 'No especificado'}</td>
                        </tr>
                        ${course.description ? `<tr><td colspan="6" style="font-size: 10px; color: #6b7280; background: #f9fafb;"><em>Descripción: ${course.description}</em></td></tr>` : ''}`).join('');

    return `
                <div class="section">
                    <div class="section-title">📖 CURSOS A GRABAR</div>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Nombre del Curso</th>
                                <th>Catedrático</th>
                                <th>Facultad</th>
                                <th>Duración</th>
                                <th>Fechas de Grabación</th>
                                <th>Hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${courseRows}
                        </tbody>
                    </table>
                </div>`;
  }

  // Generar sección de servicios
  private generateServicesSection(services: any): string {
    if (!services || (!services.mainServices?.length && !Object.keys(services.subServices || {}).length)) {
      return `
                <div class="section">
                    <div class="section-title">⚙️ SERVICIOS SOLICITADOS</div>
                    <p>No se han especificado servicios</p>
                </div>`;
    }

    const serviceLabels: Record<string, string> = {
      'audiovisual': 'Producción Audiovisual',
      'academic': 'Apoyo Académico',
      'content': 'Creación de Contenido'
    };

    const subServiceLabels: Record<string, string> = {
      'video': 'Grabación de Video',
      'audio': 'Grabación de Audio',
      'editing': 'Edición de Video',
      'streaming': 'Transmisión en vivo',
      'classroom': 'Apoyo en Aula',
      'workshop': 'Talleres Prácticos',
      'material': 'Material Didáctico',
      'graphic': 'Diseño Gráfico',
      'web': 'Diseño Web',
      'social': 'Contenido para Redes Sociales',
      'animation': 'Animación'
    };

    let servicesContent = '';
    
    if (services.mainServices && services.mainServices.length > 0) {
      services.mainServices.forEach((mainServiceId: string) => {
        const serviceName = serviceLabels[mainServiceId] || mainServiceId;
        const subServices = services.subServices?.[mainServiceId] || [];
        
        const subServicesList = subServices.map((subId: string) => 
          `<li>${subServiceLabels[subId] || subId}</li>`
        ).join('');

        servicesContent += `
                    <div class="info-item">
                        <div class="info-label">${serviceName}</div>
                        <div class="info-value">
                            ${subServices.length > 0 ? `<ul class="item-list">${subServicesList}</ul>` : 'Servicio principal seleccionado'}
                        </div>
                    </div>`;
      });
    }

    return `
                <div class="section">
                    <div class="section-title">⚙️ SERVICIOS SOLICITADOS</div>
                    <div class="info-grid single-col">
                        ${servicesContent}
                    </div>
                </div>`;
  }

  // Generar sección del solicitante
  private generateRequesterSection(requester: any): string {
    if (!requester) {
      return `
                <div class="section">
                    <div class="section-title">👤 DATOS DEL SOLICITANTE</div>
                    <p>No se han especificado datos del solicitante</p>
                </div>`;
    }

    return `
                <div class="section">
                    <div class="section-title">👤 DATOS DEL SOLICITANTE</div>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Nombre Completo</div>
                            <div class="info-value">${requester.name || 'No especificado'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Departamento/Facultad</div>
                            <div class="info-value">${requester.department || 'No especificado'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Correo Electrónico</div>
                            <div class="info-value">${requester.email || 'No especificado'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Teléfono</div>
                            <div class="info-value">${requester.phone || 'No especificado'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Fecha de Solicitud</div>
                            <div class="info-value">${requester.requestDate || new Date().toLocaleDateString('es-GT')}</div>
                        </div>
                    </div>
                    
                    ${requester.additionalNotes ? `
                    <div class="info-grid single-col">
                        <div class="info-item">
                            <div class="info-label">Notas Adicionales</div>
                            <div class="info-value large">${requester.additionalNotes}</div>
                        </div>
                    </div>` : ''}
                </div>`;
  }

  // Generar y descargar PDF
  async generateAndDownloadPDF(): Promise<void> {
    try {
      console.log('🔄 Iniciando generación de PDF profesional...');
      
      // Extraer datos estructurados
      const structuredData = await this.extractDataForPDF();
      
      if (!structuredData) {
        throw new Error('No se pudieron extraer datos suficientes para generar el PDF. Asegúrate de completar toda la información requerida.');
      }
      
      // Generar HTML profesional
      const htmlContent = this.generateHTMLContent(structuredData);
      
      // Crear blob con el HTML
      const blob = new Blob([htmlContent], { type: 'text/html; charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      // ID único para el archivo
      const requestId = `ML-${Date.now()}`;
      
      // Crear enlace de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `MediaLab_Solicitud_${structuredData.type}_${requestId}.html`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      URL.revokeObjectURL(url);
      
      console.log('✅ PDF generado y descargado:', requestId);
      
      // Abrir en nueva ventana para imprimir como PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Auto-trigger print dialog después de un pequeño delay
        setTimeout(() => {
          printWindow.print();
        }, 1500);
      }
      
    } catch (error) {
      console.error('❌ Error generando PDF:', error);
      throw new Error('No se pudo generar el PDF. Verifica que has completado toda la información requerida.');
    }
  }

  // Verificar si se puede generar PDF con datos granulares
  canGeneratePDF(): boolean {
    const conversation = groqService.getConversationHistory();
    return conversation.length > 6; // Requiere conversación más extensa para datos granulares
  }

  // Obtener vista previa de datos estructurados
  async getPreviewData(): Promise<ExtractedActivityData | null> {
    return await this.extractDataForPDF();
  }
}

// Singleton
export const pdfGenerator = new PDFGenerator();
export default PDFGenerator;