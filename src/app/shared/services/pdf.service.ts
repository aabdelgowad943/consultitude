import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  downloadPdfSummary(options: {
    userQuestion: string;
    selectedFile?: any;
    selectedConsultants: Array<{ type: string; description: string }>;
    chatMessages: Array<any>;
    finalReportContent?: string;
    chatResponse?: { content?: string };
    parseMarkdownSections: (
      content: string
    ) => Array<{ title: string; content: string }>;
  }): void {
    const {
      userQuestion,
      selectedFile,
      selectedConsultants,
      chatMessages,
      finalReportContent,
      chatResponse,
      parseMarkdownSections,
    } = options;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFillColor(81, 20, 163);
    doc.rect(0, 0, pageWidth, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('Evo Consultation Summary', 10, 15);

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    doc.setFontSize(10);
    doc.text(`Generated: ${currentDate} at ${currentTime}`, pageWidth - 70, 15);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Original Request', 10, 30);
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);

    const userQuestionLines = doc.splitTextToSize(
      userQuestion || '[No question provided]',
      pageWidth - 20
    );
    doc.text(userQuestionLines, 10, 40);
    let yPosition = 40 + userQuestionLines.length * 7;

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Document Name', 10, yPosition + 10);
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);

    const fileNameLines = doc.splitTextToSize(
      selectedFile?.name || '[No file selected]',
      pageWidth - 20
    );
    doc.text(fileNameLines, 10, yPosition + 20);
    yPosition += 20 + fileNameLines.length * 7;

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Consultants Involved', 10, yPosition + 10);
    doc.setFontSize(12);

    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = 20;
    }

    const consultantTableData = selectedConsultants.map((c) => [
      c.type,
      c.description,
    ]);

    autoTable(doc, {
      startY: yPosition + 15,
      head: [['Consultant', 'Input']],
      body: consultantTableData,
      theme: 'grid',
      headStyles: { fillColor: [81, 20, 163], textColor: [255, 255, 255] },
      margin: { top: 10 },
    });

    yPosition = doc.lastAutoTable.finalY + 10;

    if (chatMessages.length > 0) {
      if (yPosition > pageHeight - 70) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Conversation Highlights', 10, yPosition);

      const conversationData = chatMessages
        .filter((msg) => msg.sender !== 'user')
        .map((msg) => {
          const sender =
            msg.sender === 'evo'
              ? 'Evo'
              : msg.consultantInfo?.name || 'Consultant';
          return [
            sender,
            msg.text,
            new Date(msg.timestamp).toLocaleTimeString(),
          ];
        });

      autoTable(doc, {
        startY: yPosition + 5,
        head: [['Participant', 'Message', 'Time']],
        body: conversationData,
        theme: 'striped',
        headStyles: { fillColor: [81, 20, 163], textColor: [255, 255, 255] },
        margin: { top: 10 },
      });

      yPosition = doc.lastAutoTable.finalY + 10;
    }

    doc.addPage();
    doc.setFillColor(245, 247, 250);
    doc.rect(0, 0, pageWidth, 30, 'F');

    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Final Summary & Recommendations', pageWidth / 2, 20, {
      align: 'center',
    });

    const finalContent =
      finalReportContent ||
      chatResponse?.content ||
      'No final recommendations available';
    const sections = parseMarkdownSections(finalContent);

    let currentY = 40;
    sections.forEach((section) => {
      if (section.title) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(81, 20, 163);
        doc.text(section.title, 10, currentY);
        currentY += 10;
      }

      if (section.content) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);

        const contentLines = section.content.split('\n');
        contentLines.forEach((line) => {
          if (line.trim().startsWith('- ')) {
            const bulletText = line.trim().substring(2);
            const formattedLines = doc.splitTextToSize(
              bulletText,
              pageWidth - 30
            );
            doc.text('•', 15, currentY);
            doc.text(formattedLines, 20, currentY);
            currentY += formattedLines.length * 7;
          } else {
            const formattedLines = doc.splitTextToSize(line, pageWidth - 20);
            doc.text(formattedLines, 10, currentY);
            currentY += formattedLines.length * 7;
          }

          currentY += 3;
          if (currentY > pageHeight - 20) {
            doc.addPage();
            currentY = 20;
          }
        });
      }

      doc.setDrawColor(200, 200, 200);
      doc.line(10, currentY, pageWidth - 10, currentY);
      currentY += 10;

      if (currentY > pageHeight - 40) {
        doc.addPage();
        currentY = 20;
      }
    });

    doc.save(
      `Evo_Consultation_Summary_${new Date().toISOString().slice(0, 10)}.pdf`
    );
  }
}
