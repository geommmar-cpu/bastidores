import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const exportToExcel = (members, settings) => {
  const data = members.map(m => {
    const shirtsText = m.shirts && m.shirts.length > 0 
      ? m.shirts.map(s => `${s.quantity}x ${s.size}`).join(', ') 
      : 'Nenhuma';
      
    return {
      'Nome': (m.name || '').toUpperCase(),
      'Telefone': m.phone,
      'Nome Cônjuge': m.type === 'Casal' ? ((m.spouseName || '').toUpperCase() || '-') : '-',
      'Tel Cônjuge': m.type === 'Casal' ? (m.spousePhone || '-') : '-',
      'Endereço': m.address,
      'Bairro': m.neighborhood || '-',
      'Função': m.role,
      'Tipo': m.type,
      'Gênero': m.type === 'Jovem' ? (m.gender === 'M' ? 'Masculino' : 'Feminino') : '-',
      'Ficha': m.registrationType,
      'Camisas': shirtsText,
      'Valor Total': formatCurrency(m.totalValue),
      'Valor Pago': formatCurrency(m.paidValue),
      'Status': m.paymentStatus
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Membros");
  XLSX.writeFile(wb, `Bastidores_${settings.eventName.replace(/\s+/g, '_')}.xlsx`);
};

export const exportToPDF = (members, settings) => {
  const doc = new jsPDF('landscape');
  
  // Custom Header
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  
  const textCenter = (text, y) => {
    const textWidth = doc.getTextWidth(text);
    doc.text(text, (doc.internal.pageSize.width - textWidth) / 2, y);
  };
  
  textCenter("Diocese de Luziânia", 15);
  textCenter("Paróquia Santuário de Santo Antônio", 20);
  textCenter("Santo Antônio do Descoberto - Goiás", 25);
  textCenter(`MONTAGEM ${new Date().getFullYear()}`, 32);
  
  // Team Header Bar
  doc.setFillColor(30, 30, 30);
  doc.rect(14, 35, doc.internal.pageSize.width - 28, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  textCenter("EQUIPE BASTIDORES", 39.5);
  
  doc.setTextColor(0, 0, 0);

  // Groups
  const groups = [
    { title: "COORDENADORES", filter: m => !m.isDropout && m.role === 'Coordenador' },
    { title: "CASAL APOIO", filter: m => !m.isDropout && m.role === 'Casal Apoio' },
    { title: "COMPONENTES TIOS", filter: m => !m.isDropout && m.role === 'Componente' && m.type === 'Casal' },
    { title: "COMPONENTES JOVENS (MENINOS)", filter: m => !m.isDropout && m.role === 'Componente' && m.type === 'Jovem' && m.gender === 'M' },
    { title: "COMPONENTES JOVENS (MENINAS)", filter: m => !m.isDropout && m.role === 'Componente' && m.type === 'Jovem' && m.gender === 'F' },
    { title: "DESISTENTES", filter: m => m.isDropout, isDropoutGroup: true }
  ];

  const tableColumn = ["QTD", "NOME", "TELEFONE", "ENDEREÇO", "BAIRRO"];
  const body = [];

  groups.forEach(group => {
    const groupMembers = members.filter(group.filter);
    
    if (groupMembers.length > 0) {
      // Add section header row
      body.push([
        { 
          content: group.title, 
          colSpan: 5, 
          styles: { halign: 'center', fillColor: [180, 180, 180], fontStyle: 'bold', textColor: [0, 0, 0] } 
        }
      ]);

      // Add members
      groupMembers.forEach(m => {
        const qty = m.type === 'Casal' ? '2' : '1';
        
        let nameText = m.name || '';
        if (m.type === 'Casal' && m.spouseName) {
          nameText = `${m.name} E ${m.spouseName}`;
        }
        
        let phoneText = m.phone || '';
        if (m.type === 'Casal' && m.spousePhone) {
          phoneText = `${m.phone} / ${m.spousePhone}`;
        }

        body.push([
          { content: qty, styles: { halign: 'center', textColor: group.isDropoutGroup ? [180, 0, 0] : [0, 0, 0] } },
          { content: nameText.toUpperCase(), styles: { textColor: group.isDropoutGroup ? [180, 0, 0] : [0, 0, 0], fontStyle: group.isDropoutGroup ? 'italic' : 'normal' } },
          { content: phoneText, styles: { halign: 'center', textColor: group.isDropoutGroup ? [180, 0, 0] : [0, 0, 0] } },
          { content: group.isDropoutGroup ? `MOTIVO: ${m.dropoutReason || 'Não informado'}` : (m.address || '-'), colSpan: group.isDropoutGroup ? 2 : 1, styles: { halign: group.isDropoutGroup ? 'left' : 'center', textColor: group.isDropoutGroup ? [180, 0, 0] : [0, 0, 0] } },
          ...(group.isDropoutGroup ? [] : [{ content: m.neighborhood || '-', styles: { halign: 'center' } }])
        ]);
      });
    }
  });

  // Footer totals row could be added here if needed
  const totalQty = members.reduce((sum, m) => sum + (m.type === 'Casal' ? 2 : 1), 0);
  body.push([
    { 
      content: `TOTAL DE COMPONENTES: ${totalQty}`, 
      colSpan: 5, 
      styles: { halign: 'center', fillColor: [30, 30, 30], textColor: [255, 255, 255], fontStyle: 'bold' } 
    }
  ]);

  autoTable(doc, {
    startY: 42,
    head: [tableColumn],
    body: body,
    theme: 'grid',
    styles: { 
      fontSize: 8,
      cellPadding: 1,
      lineColor: [100, 100, 100],
      lineWidth: 0.1
    },
    headStyles: { 
      fillColor: [30, 30, 30], 
      textColor: [255, 255, 255],
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 40 },
      3: { cellWidth: 60 },
      4: { cellWidth: 40 }
    },
    margin: { top: 10, left: 14, right: 14 }
  });

  doc.save(`Bastidores_${settings.eventName.replace(/\s+/g, '_')}.pdf`);
};
