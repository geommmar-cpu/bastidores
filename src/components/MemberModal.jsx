import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Plus, Trash2 } from 'lucide-react';

const SHIRT_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG'];

const MemberModal = ({ onClose, editingMember }) => {
  const { settings, addMember, updateMember } = useContext(AppContext);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    type: 'Jovem',
    registrationType: 'Com Camisa',
    shirts: [],
    totalValue: settings.priceWithShirt,
    paidValue: 0,
    spousePhone: '',
    role: 'Componente',
    gender: 'M',
    neighborhood: '',
    receipts: [],
    isDropout: false,
    dropoutReason: ''
  });

  useEffect(() => {
    if (editingMember) {
      setFormData({
        ...editingMember,
        receipts: editingMember.receipts || (editingMember.receipt ? [{ type: 'image', name: 'Comprovante Antigo', data: editingMember.receipt }] : [])
      });
    }
  }, [editingMember]);

  // Recalculate total value when type or shirts change (only if not editing, or if user changes type)
  useEffect(() => {
    if (!editingMember) {
      let total = 0;
      if (formData.type === 'Casal') {
        total = formData.registrationType === 'Com Camisa' 
          ? (settings.priceWithShirtCasal || 260) 
          : (settings.priceWithoutShirtCasal || 160);
      } else {
        total = formData.registrationType === 'Com Camisa' 
          ? (settings.priceWithShirt || 130) 
          : (settings.priceWithoutShirt || 80);
      }
      setFormData(prev => ({ ...prev, totalValue: total }));
    }
  }, [formData.registrationType, formData.type, settings.priceWithShirt, settings.priceWithoutShirt, settings.priceWithShirtCasal, settings.priceWithoutShirtCasal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    files.forEach(file => {
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          setFormData(prev => ({ 
            ...prev, 
            receipts: [...(prev.receipts || []), { type: 'pdf', name: file.name, data: event.target.result }] 
          }));
        };
      } else if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const scaleSize = MAX_WIDTH / img.width;
            
            if (scaleSize < 1) {
              canvas.width = MAX_WIDTH;
              canvas.height = img.height * scaleSize;
            } else {
              canvas.width = img.width;
              canvas.height = img.height;
            }
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            setFormData(prev => ({ 
              ...prev, 
              receipts: [...(prev.receipts || []), { type: 'image', name: file.name, data: dataUrl }] 
            }));
          };
        };
      } else {
        alert(`O arquivo ${file.name} não é suportado. Envie apenas PDF ou Imagens.`);
      }
    });
  };

  const handleRemoveReceipt = (index) => {
    setFormData(prev => ({ 
      ...prev, 
      receipts: prev.receipts.filter((_, i) => i !== index) 
    }));
  };

  const handleAddShirt = () => {
    setFormData(prev => ({
      ...prev,
      shirts: [...prev.shirts, { size: 'M', quantity: 1 }]
    }));
  };

  const handleRemoveShirt = (index) => {
    setFormData(prev => ({
      ...prev,
      shirts: prev.shirts.filter((_, i) => i !== index)
    }));
  };

  const handleShirtChange = (index, field, value) => {
    const newShirts = [...formData.shirts];
    newShirts[index][field] = value;
    setFormData(prev => ({ ...prev, shirts: newShirts }));
  };

  const calculateStatus = (total, paid, isDropout) => {
    if (isDropout) return 'Desistente';
    if (paid >= total && total > 0) return 'Pago';
    if (paid > 0) return 'Parcial';
    return 'Pendente';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const memberData = {
      ...formData,
      totalValue: parseFloat(formData.totalValue) || 0,
      paidValue: parseFloat(formData.paidValue) || 0,
      paymentStatus: calculateStatus(parseFloat(formData.totalValue) || 0, parseFloat(formData.paidValue) || 0, formData.isDropout)
    };

    if (editingMember) {
      updateMember(editingMember.id, memberData);
    } else {
      addMember(memberData);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{editingMember ? 'Editar Membro' : 'Novo Membro'}</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="modal-body">
          <form id="member-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="input-group">
                <label className="input-label">Nome Completo</label>
                <input required type="text" name="name" className="input" value={formData.name} onChange={handleChange} />
              </div>
              
              <div className="input-group">
                <label className="input-label">Telefone</label>
                <input required type="tel" name="phone" className="input" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="input-group">
                <label className="input-label">Endereço</label>
                <input type="text" name="address" className="input" value={formData.address} onChange={handleChange} />
              </div>
              
              <div className="input-group">
                <label className="input-label">Bairro</label>
                <input type="text" name="neighborhood" className="input" value={formData.neighborhood || ''} onChange={handleChange} />
              </div>

              <div className="input-group">
                <label className="input-label">Função na Equipe</label>
                <select name="role" className="input" value={formData.role || 'Componente'} onChange={handleChange}>
                  <option value="Componente">Componente</option>
                  <option value="Coordenador">Coordenador</option>
                  <option value="Casal Apoio">Casal Apoio</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Tipo</label>
                <select name="type" className="input" value={formData.type} onChange={handleChange}>
                  <option value="Jovem">Jovem</option>
                  <option value="Casal">Casal</option>
                </select>
              </div>

              {formData.type === 'Jovem' && (
                <div className="input-group">
                  <label className="input-label">Gênero</label>
                  <select name="gender" className="input" value={formData.gender || 'M'} onChange={handleChange}>
                    <option value="M">Masculino (Menino)</option>
                    <option value="F">Feminino (Menina)</option>
                  </select>
                </div>
              )}

              {formData.type === 'Casal' && (
                <>
                  <div className="input-group">
                    <label className="input-label">Nome do Cônjuge</label>
                    <input type="text" name="spouseName" className="input" value={formData.spouseName || ''} onChange={handleChange} />
                  </div>
                  
                  <div className="input-group">
                    <label className="input-label">Telefone do Cônjuge</label>
                    <input type="tel" name="spousePhone" className="input" value={formData.spousePhone || ''} onChange={handleChange} />
                  </div>
                </>
              )}

              <div className="input-group md:col-span-2">
                <label className="input-label">Tipo de Ficha</label>
                <select name="registrationType" className="input" value={formData.registrationType} onChange={handleChange}>
                  <option value="Com Camisa">Com Camisa</option>
                  <option value="Sem Camisa">Sem Camisa</option>
                </select>
              </div>
            </div>

            {formData.registrationType === 'Com Camisa' && (
              <div className="mt-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="input-label">Camisas</label>
                  <button type="button" className="btn btn-secondary text-sm" onClick={handleAddShirt} style={{ padding: '0.25rem 0.5rem' }}>
                    <Plus size={14} /> Adicionar Camisa
                  </button>
                </div>
                
                {formData.shirts.length === 0 ? (
                  <p className="text-sm text-muted">Nenhuma camisa adicionada.</p>
                ) : (
                  formData.shirts.map((shirt, index) => (
                    <div key={index} className="shirt-item">
                      <div className="input-group" style={{ margin: 0, flex: 1 }}>
                        <label className="input-label">Tamanho</label>
                        <select className="input" value={shirt.size} onChange={(e) => handleShirtChange(index, 'size', e.target.value)}>
                          {SHIRT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="input-group" style={{ margin: 0, flex: 1 }}>
                        <label className="input-label">Qtd</label>
                        <input type="number" min="1" className="input" value={shirt.quantity} onChange={(e) => handleShirtChange(index, 'quantity', e.target.value)} />
                      </div>
                      <button type="button" className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => handleRemoveShirt(index)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border-color)' }} />
            
            <h3 className="text-lg mb-4 text-red-600">Desistência</h3>
            <div className="input-group">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isDropout"
                  checked={formData.isDropout}
                  onChange={(e) => setFormData(prev => ({ ...prev, isDropout: e.target.checked }))}
                  style={{ width: '1.2rem', height: '1.2rem' }}
                />
                <span className="font-bold">Marcar como desistente</span>
              </label>
            </div>
            
            {formData.isDropout && (
              <div className="input-group mt-2">
                <label className="input-label">Motivo da desistência</label>
                <input 
                  type="text" 
                  name="dropoutReason" 
                  className="input border-red-300 bg-red-50" 
                  value={formData.dropoutReason || ''} 
                  onChange={handleChange} 
                  placeholder="Ex: Problemas de saúde, viagem..."
                />
              </div>
            )}

            <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border-color)' }} />
            
            <h3 className="text-lg mb-4">Financeiro</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="input-group">
                <label className="input-label">Valor Total (R$)</label>
                <input required type="number" step="0.01" min="0" name="totalValue" className="input" value={formData.totalValue} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label className="input-label">Valor Pago (R$)</label>
                <input required type="number" step="0.01" min="0" name="paidValue" className="input" value={formData.paidValue} onChange={handleChange} />
              </div>
            </div>
            
            
            <div className="mt-2 text-sm">
              Status calculado: <span className="font-bold">{calculateStatus(parseFloat(formData.totalValue) || 0, parseFloat(formData.paidValue) || 0, formData.isDropout)}</span>
            </div>

            <div className="mt-4 p-4" style={{ backgroundColor: '#F9FAFB', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <label className="input-label mb-2 block">Comprovantes de Pagamento</label>
              
              <div className="input-group mb-4" style={{ margin: 0 }}>
                <input type="file" multiple accept="image/*,application/pdf" className="input" onChange={handleFileUpload} />
                <p className="text-xs text-muted mt-1">Você pode selecionar múltiplos arquivos (PDF ou Imagens).</p>
              </div>

              {formData.receipts && formData.receipts.length > 0 && (
                <div className="flex flex-col gap-4 mt-4">
                  <p className="text-sm font-bold">Anexos ({formData.receipts.length}):</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.receipts.map((receipt, index) => (
                      <div key={index} className="flex flex-col gap-2 p-2" style={{ backgroundColor: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        <div style={{ maxHeight: '150px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
                          {receipt.type === 'pdf' ? (
                            <div className="p-4 text-center">
                              <span className="font-bold text-red-500">PDF</span>
                              <p className="text-xs mt-1 truncate max-w-[150px]">{receipt.name}</p>
                            </div>
                          ) : (
                            <img src={receipt.data} alt={`Comprovante ${index + 1}`} style={{ width: '100%', objectFit: 'contain', maxHeight: '150px' }} />
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button type="button" className="btn btn-secondary text-sm flex-1" onClick={() => {
                            const newTab = window.open();
                            if (receipt.type === 'pdf') {
                              newTab.document.write(`<iframe src="${receipt.data}" width="100%" height="100%" style="border:none;"></iframe>`);
                            } else {
                              newTab.document.write(`<img src="${receipt.data}" style="max-width:100%;" />`);
                            }
                          }}>
                            Abrir
                          </button>
                          <button type="button" className="btn btn-danger text-sm" onClick={() => handleRemoveReceipt(index)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
        
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" form="member-form" className="btn btn-primary">Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default MemberModal;
