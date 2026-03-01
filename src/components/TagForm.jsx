import { useState, useEffect } from 'react';
import { tagService } from '../services/tag.service';

function TagForm({ tag, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    color: '#8B5CF6' 
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const presetColors = [
    { color: '#EF4444', name: 'Rojo' },
    { color: '#F97316', name: 'Naranja' },
    { color: '#F59E0B', name: 'Ámbar' },
    { color: '#10B981', name: 'Verde' },
    { color: '#14B8A6', name: 'Teal' },
    { color: '#3B82F6', name: 'Azul' },
    { color: '#6366F1', name: 'Índigo' },
    { color: '#8B5CF6', name: 'Violeta' },
    { color: '#EC4899', name: 'Rosa' },
    { color: '#6B7280', name: 'Gris' },
  ];

  useEffect(() => {
    if (tag) {
      setFormData({
        name: tag.name || '',
        color: tag.color || '#8B5CF6'
      });
    }
  }, [tag]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
  };

  const handleColorSelect = (color) => {
    setFormData(prev => ({ ...prev, color }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setTouchedFields({ name: true, color: true });
      return;
    }

    setLoading(true);

    try {
      if (tag) {
        await tagService.update(tag.id, formData);
        alert('Etiqueta actualizada exitosamente');
      } else {
        console.log(tag);
        await tagService.create(formData);
        alert('Etiqueta creada exitosamente');
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar etiqueta:', error);
      alert('Error al guardar la etiqueta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl border border-blue-100/50 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 px-8 py-7 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-300 rounded-full blur-3xl -mr-20 -mt-20"></div>
        </div>
        <div className="relative z-10">
          <h3 className="text-3xl font-bold text-white flex items-center gap-3">
            {tag ? '✏️ Editar Etiqueta' : '➕ Nueva Etiqueta'}
          </h3>
          <p className="text-blue-100 text-sm mt-2 font-medium">
            {tag  
              ? 'Actualiza los detalles de tu etiqueta'
              : 'Crea una nueva etiqueta para organizar tus tareas'
            }
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="space-y-7">
          <div>
            <label className="block text-sm font-bold text-white mb-3 flex items-center gap-2">
              🏷️ Nombre
              <span className="text-red-400 text-lg">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-5 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                  errors.name && touchedFields.name
                    ? 'border-red-500 bg-red-900/30 focus:border-red-400 focus:ring-2 focus:ring-red-400/50 focus:ring-offset-2 focus:ring-offset-gray-800'
                    : 'border-gray-600 bg-gray-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-gray-900'
                } placeholder-gray-500 text-white font-medium text-base shadow-sm hover:shadow-md`}
                placeholder="Ej: Urgente, Importante, En revisión"
                disabled={loading}
              />
              {formData.name && !errors.name && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 text-lg animate-scale-in">✓</span>
              )}
            </div>
            {errors.name && touchedFields.name && (
              <div className="mt-3 flex items-center gap-2 text-red-300 text-sm bg-red-900/30 px-4 py-3 rounded-xl border border-red-700/60 shadow-sm">
                <span className="text-lg">⚠️</span>
                <span className="font-medium">{errors.name}</span>
              </div>
            )}
          </div>

          {/* Selector de Color */}
          <div>
            <label className="block text-sm font-bold text-white mb-4 flex items-center gap-2">
              🎨 Color de la etiqueta
            </label>

            <div className="mb-6 p-5 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border border-gray-700 shadow-sm">
              <p className="text-xs font-bold text-gray-300 mb-4 uppercase tracking-wide">Colores sugeridos:</p>
              <div className="grid grid-cols-5 gap-3">
                {presetColors.map((preset) => (
                  <button
                    key={preset.color}
                    type="button"
                    onClick={() => handleColorSelect(preset.color)}
                    className={`relative w-full h-14 rounded-xl border-3 transition-all duration-300 hover:scale-110 group shadow-md hover:shadow-xl ${
                      formData.color === preset.color 
                        ? 'border-gray-900 shadow-xl ring-2 ring-offset-2 ring-blue-400 scale-105' 
                        : 'border-transparent hover:border-blue-300'
                    }`}
                    style={{ backgroundColor: preset.color }}
                    title={preset.name}
                  >
                    {formData.color === preset.color && (
                      <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold drop-shadow-lg animate-smooth-bounce">
                        ✓
                      </span>
                    )}
                    <span className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5 items-end">
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  Selector personalizado
                </label>
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full h-14 border-2 border-gray-600 rounded-xl cursor-pointer hover:border-cyan-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 shadow-md hover:shadow-lg"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  Código hexadecimal
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-600 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none font-mono text-sm uppercase font-bold transition-all duration-300 shadow-sm hover:shadow-md text-white bg-gray-800"
                  placeholder="#3B82F6"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end pt-8 border-t-2 border-gray-700 mt-8">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-7 py-3 bg-gray-700 text-gray-200 font-bold rounded-xl hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg border border-gray-600 hover:border-gray-500"
          >
            ✕ Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin text-lg">⏳</span>
                Guardando...
              </>
            ) : (
              <>
                {tag ? '✓ Actualizar' : '➕ Crear'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TagForm;