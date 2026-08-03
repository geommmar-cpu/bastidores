import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X } from 'lucide-react';

const SettingsModal = ({ onClose }) => {
  const { settings, updateSettings } = useContext(AppContext);
  
  const [formData, setFormData] = useState({
    eventName: settings.eventName,
    priceWithShirt: settings.priceWithShirt || 130,
    priceWithoutShirt: settings.priceWithoutShirt || 80,
    priceWithShirtCasal: settings.priceWithShirtCasal || 260,
    priceWithoutShirtCasal: settings.priceWithoutShirtCasal || 160,
    coordinators: [...settings.coordinators]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoordinatorChange = (index, value) => {
    const newCoords = [...formData.coordinators];
    newCoords[index] = value;
    setFormData(prev => ({ ...prev, coordinators: newCoords }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings({
      ...formData,
      priceWithShirt: parseFloat(formData.priceWithShirt) || 0,
      priceWithoutShirt: parseFloat(formData.priceWithoutShirt) || 0,
      priceWithShirtCasal: parseFloat(formData.priceWithShirtCasal) || 0,
      priceWithoutShirtCasal: parseFloat(formData.priceWithoutShirtCasal) || 0
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Configurações do Evento</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="modal-body">
          <form id="settings-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Nome do Evento</label>
              <input required type="text" name="eventName" className="input" value={formData.eventName} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
              <div className="input-group">
                <label className="input-label">Ficha Individual (Com Camisa)</label>
                <input required type="number" step="0.01" min="0" name="priceWithShirt" className="input" value={formData.priceWithShirt} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label className="input-label">Ficha Individual (Sem Camisa)</label>
                <input required type="number" step="0.01" min="0" name="priceWithoutShirt" className="input" value={formData.priceWithoutShirt} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label className="input-label">Ficha Casal (Com Camisa)</label>
                <input required type="number" step="0.01" min="0" name="priceWithShirtCasal" className="input" value={formData.priceWithShirtCasal} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label className="input-label">Ficha Casal (Sem Camisa)</label>
                <input required type="number" step="0.01" min="0" name="priceWithoutShirtCasal" className="input" value={formData.priceWithoutShirtCasal} onChange={handleChange} />
              </div>
            </div>
            
            <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border-color)' }} />
            
            <h3 className="text-lg mb-4">Coordenadores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="input-group">
                  <label className="input-label">Coordenador {index + 1}</label>
                  <input 
                    required 
                    type="text" 
                    className="input" 
                    value={formData.coordinators[index] || ''} 
                    onChange={(e) => handleCoordinatorChange(index, e.target.value)} 
                  />
                </div>
              ))}
            </div>
          </form>
        </div>
        
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="submit" form="settings-form" className="btn btn-primary">Salvar Configurações</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
