// src/services/pdfGenerator.ts
import { groqService, type ExtractedActivityData } from './groqService';

class PDFGenerator {
  
  // Validar qué datos faltan específicamente
  private validateDataCompleteness(data: ExtractedActivityData | null): { isValid: boolean; missingFields: string[] } {
    const missingFields: string[] = [];
    
    if (!data) {
      return { isValid: false, missingFields: ['No se pudieron extraer datos de la conversación'] };
    }

    // Validaciones comunes para todos los tipos
    if (!data.requester?.name || data.requester.name === 'No especificado') {
      missingFields.push('Nombre completo del solicitante');
    }
    
    if (!data.requester?.email || data.requester.email === 'No especificado') {
      missingFields.push('Correo electrónico institucional');
    }
    
    if (!data.requester?.department || data.requester.department === 'No especificado') {
      missingFields.push('Departamento/Facultad del solicitante');
    }

    // Validaciones específicas por tipo
    switch (data.type) {
      case 'single':
        if (!data.activityName || data.activityName === 'No especificado') {
          missingFields.push('Nombre específico de la actividad');
        }
        if (!data.faculty || data.faculty === 'No especificado') {
          missingFields.push('Facultad responsable');
        }
        if (!data.date || data.date === 'No especificado') {
          missingFields.push('Fecha específica (DD/MM/YYYY)');
        }
        if (!data.startTime || data.startTime === 'No especificado') {
          missingFields.push('Hora de inicio');
        }
        if (!data.endTime || data.endTime === 'No especificado') {
          missingFields.push('Hora de fin');
        }
        if (!data.location?.type) {
          missingFields.push('Tipo de ubicación');
        }
        if (data.location?.type === 'university' && (!data.location.tower || !data.location.classroom)) {
          missingFields.push('Torre y salón específicos');
        }
        if (data.location?.type === 'external' && !data.location.externalAddress) {
          missingFields.push('Dirección externa completa');
        }
        break;
        
      case 'recurrent':
        if (!data.activityName || data.activityName === 'No especificado') {
          missingFields.push('Nombre de la actividad recurrente');
        }
        if (!data.recurrence?.startDate || !data.recurrence?.endDate) {
          missingFields.push('Fechas de inicio y fin del periodo');
        }
        break;
        
      case 'podcast':
        if (!data.podcastName || data.podcastName === 'No especificado') {
          missingFields.push('Nombre del podcast');
        }
        break;
        
      case 'course':
        if (!data.careerName || data.careerName === 'No especificado') {
          missingFields.push('Nombre de la carrera');
        }
        break;
    }

    return { isValid: missingFields.length === 0, missingFields };
  }

  // Generar mensaje de ayuda específico
  private generateHelpMessage(missingFields: string[]): string {
    let helpMessage = `❌ **No se puede generar el PDF - Información faltante:**\n\n`;
    
    missingFields.forEach((field, index) => {
      helpMessage += `${index + 1}. ${field}\n`;
    });
    
    helpMessage += `\n**💡 Para completar tu solicitud, proporciona:**\n`;
    helpMessage += `- Datos administrativos básicos\n`;
    helpMessage += `- Fechas específicas en formato DD/MM/YYYY\n`;
    helpMessage += `- Ubicación exacta (torre + salón)\n`;
    helpMessage += `- Tu información de contacto completa\n\n`;
    helpMessage += `*Nota: Los detalles técnicos (tipo de fotos, ángulos, etc.) se definirán en reuniones posteriores con el equipo técnico.*`;
    
    return helpMessage;
  }

  // Generar datos estructurados de la conversación con validación
  async extractDataForPDF(): Promise<{ data: ExtractedActivityData | null; validation: { isValid: boolean; missingFields: string[] } }> {
    try {
      console.log('🔄 Extrayendo datos estructurados para PDF...');
      
      // Usar el método de extracción granular
      const structuredData = await groqService.extractStructuredData();
      
      console.log('📊 Datos extraídos:', structuredData);
      
      // Validar completitud
      const validation = this.validateDataCompleteness(structuredData);
      
      if (!validation.isValid) {
        console.warn('⚠️ Datos incompletos:', validation.missingFields);
      } else {
        console.log('✅ Datos completos y válidos');
      }
      
      return { data: structuredData, validation };
      
    } catch (error) {
      console.error('❌ Error extrayendo datos para PDF:', error);
      return { 
        data: null, 
        validation: { 
          isValid: false, 
          missingFields: ['Error técnico extrayendo datos de la conversación'] 
        } 
      };
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
            
            /* Servicios estructurados */
            .services-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 12px;
                margin-bottom: 15px;
            }
            
            .service-category {
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                padding: 12px;
                background: #f9fafb;
            }
            
            .service-category-title {
                font-weight: bold;
                color: #1e40af;
                font-size: 12px;
                margin-bottom: 8px;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 4px;
            }
            
            .service-item {
                display: flex;
                align-items: center;
                margin-bottom: 4px;
                font-size: 11px;
            }
            
            .service-checkbox {
                width: 12px;
                height: 12px;
                border: 1px solid #9ca3af;
                margin-right: 6px;
                flex-shrink: 0;
                display: inline-block;
            }
            
            .service-checkbox.checked {
                background: #10b981;
                border-color: #10b981;
                position: relative;
            }
            
            .service-checkbox.checked:after {
                content: '✓';
                color: white;
                font-size: 8px;
                position: absolute;
                top: -1px;
                left: 2px;
            }
            
            .service-details {
                font-size: 10px;
                color: #6b7280;
                margin-left: 18px;
                font-style: italic;
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
                    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 4px; padding: 8px; margin: 8px 0; font-size: 11px; color: #1e40af;">
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

  // Generar sección de servicios ESTRUCTURADOS
  private generateServicesSection(services: any): string {
    if (!services) {
      return `
                <div class="section">
                    <div class="section-title">⚙️ SERVICIOS SOLICITADOS</div>
                    <p>No se han especificado servicios</p>
                </div>`;
    }

    // Definición de todos los servicios disponibles con estructura
    const availableServices = {
      video: {
        name: 'Grabación de Video',
        category: 'Producción Audiovisual',
        icon: '🎥'
      },
      audio: {
        name: 'Grabación de Audio',
        category: 'Producción Audiovisual',
        icon: '🎵'
      },
      photography: {
        name: 'Fotografía',
        category: 'Producción Audiovisual',
        icon: '📸'
      },
      streaming: {
        name: 'Transmisión en Vivo',
        category: 'Producción Audiovisual',
        icon: '📡'
      },
      editing: {
        name: 'Edición de Video',
        category: 'Postproducción',
        icon: '✂️'
      },
      design: {
        name: 'Diseño Gráfico',
        category: 'Contenido Digital',
        icon: '🎨'
      },
      animation: {
        name: 'Animación',
        category: 'Contenido Digital',
        icon: '🎬'
      },
      social: {
        name: 'Contenido para Redes',
        category: 'Contenido Digital',
        icon: '📱'
      }
    };

    // Organizar servicios por categorías
    const servicesByCategory: { [key: string]: any[] } = {};
    
    // Procesar servicios estructurados
    if (services.mainServices && Array.isArray(services.mainServices)) {
      services.mainServices.forEach((serviceId: string) => {
        const subServices = services.subServices?.[serviceId] || [];
        
        subServices.forEach((subServiceId: string) => {
          const serviceInfo = availableServices[subServiceId as keyof typeof availableServices];
          if (serviceInfo) {
            const category = serviceInfo.category;
            if (!servicesByCategory[category]) {
              servicesByCategory[category] = [];
            }
            servicesByCategory[category].push({
              id: subServiceId,
              name: serviceInfo.name,
              icon: serviceInfo.icon,
              requested: true,
              details: services.details?.[subServiceId] || null
            });
          }
        });
      });
    }

    // Si no hay servicios estructurados, intentar extraer de servicios básicos
    if (Object.keys(servicesByCategory).length === 0 && services.mainServices) {
      const defaultCategory = 'Servicios Generales';
      servicesByCategory[defaultCategory] = services.mainServices.map((service: string) => ({
        id: service,
        name: service,
        icon: '⚙️',
        requested: true,
        details: null
      }));
    }

    // Agregar servicios no solicitados pero relevantes para mostrar completitud
    Object.entries(availableServices).forEach(([serviceId, serviceInfo]) => {
      const category = serviceInfo.category;
      if (!servicesByCategory[category]) {
        servicesByCategory[category] = [];
      }
      
      const exists = servicesByCategory[category].some(s => s.id === serviceId);
      if (!exists) {
        servicesByCategory[category].push({
          id: serviceId,
          name: serviceInfo.name,
          icon: serviceInfo.icon,
          requested: false,
          details: null
        });
      }
    });

    // Generar HTML por categorías
    let categoriesHTML = '';
    Object.entries(servicesByCategory).forEach(([category, categoryServices]) => {
      const servicesHTML = categoryServices.map(service => {
        const checkboxClass = service.requested ? 'service-checkbox checked' : 'service-checkbox';
        const detailsHTML = service.details ? 
          `<div class="service-details">${service.details}</div>` : '';
        
        return `
                            <div class="service-item">
                                <div class="${checkboxClass}"></div>
                                <span>${service.icon} ${service.name}</span>
                            </div>
                            ${detailsHTML}`;
      }).join('');

      categoriesHTML += `
                        <div class="service-category">
                            <div class="service-category-title">${category}</div>
                            ${servicesHTML}
                        </div>`;
    });

    return `
                <div class="section">
                    <div class="section-title">⚙️ SERVICIOS SOLICITADOS</div>
                    <div class="services-grid">
                        ${categoriesHTML}
                    </div>
                    <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 4px; padding: 8px; margin: 8px 0; font-size: 10px; color: #0c4a6e;">
                        <strong>Nota:</strong> Los servicios marcados (✓) han sido solicitados. Los detalles técnicos específicos se coordinarán en reuniones posteriores con el equipo técnico de MediaLab.
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

  // Método alternativo para generar PDF (usando window.print)
  private generatePDFAlternative(htmlContent: string, requestId: string, activityType: string): void {
    try {
      // Crear ventana nueva para imprimir
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        throw new Error('No se pudo abrir ventana para impresión. Verifica que no esté bloqueada por el navegador.');
      }

      // Escribir contenido HTML
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Configurar título de la ventana
      printWindow.document.title = `Solicitud_MediaLab_${requestId}_${activityType}`;

      // Esperar a que cargue y luego imprimir
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };

      console.log('✅ Ventana de impresión abierta exitosamente');
      
    } catch (error) {
      console.error('❌ Error abriendo ventana de impresión:', error);
      throw new Error(`Error técnico: ${error instanceof Error ? error.message : 'Problema desconocido'}`);
    }
  }

  // Verificar si se puede generar PDF
  canGeneratePDF(): boolean {
    // Verificar que hay suficiente conversación
    const conversation = groqService.getConversationHistory();
    const userMessages = conversation.filter(msg => msg.role === 'user').length;
    
    console.log(`📊 Mensajes de usuario en conversación: ${userMessages}`);
    
    // Necesita al menos 3 intercambios sustanciales
    return userMessages >= 3;
  }

  // Generar y descargar PDF con mejor manejo de errores
  async generateAndDownloadPDF(): Promise<string> {
    try {
      console.log('🔄 Iniciando generación de PDF profesional...');
      
      // Extraer y validar datos estructurados
      const { data: structuredData, validation } = await this.extractDataForPDF();
      
      if (!validation.isValid) {
        const helpMessage = this.generateHelpMessage(validation.missingFields);
        throw new Error(helpMessage);
      }
      
      if (!structuredData) {
        throw new Error('❌ **Error técnico**\n\nNo se pudieron extraer datos de la conversación. Intenta reformular tu solicitud con más detalles específicos.');
      }
      
      // ID único para el archivo
      const requestId = `ML-${Date.now()}`;
      
      // Generar HTML profesional
      const htmlContent = this.generateHTMLContent(structuredData);
      
      // Generar PDF optimizado
      console.log('📄 Generando PDF optimizado...');
      this.generatePDFAlternative(htmlContent, requestId, structuredData.type);
      
      return '✅ **¡PDF generado exitosamente!**\n\nTu solicitud oficial ha sido generada. Se abrió una nueva ventana para imprimir el documento como PDF.\n\n*Consejo: Usa Ctrl+P y selecciona "Guardar como PDF" para obtener el mejor resultado.*';
      
    } catch (error) {
      console.error('❌ Error generando PDF:', error);
      
      if (error instanceof Error && error.message.includes('❌')) {
        // Error con mensaje de ayuda formateado
        return error.message;
      } else {
        // Error técnico inesperado
        return `❌ **Error técnico inesperado**\n\n${error instanceof Error ? error.message : 'Error desconocido'}\n\nPor favor intenta nuevamente o contacta soporte si el problema persiste.`;
      }
    }
  }
}

// Exportar instancia singleton
export const pdfGenerator = new PDFGenerator();
export default PDFGenerator;