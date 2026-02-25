import { useState, useEffect } from 'react';
import { categoryService } from '../services/category.service';

function CategoryForm({ category, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || ''});
    }
  }, [category]);

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

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      if (category) {
        await categoryService.update(category.id, formData);
        alert('Categoría actualizada exitosamente');
      } else {
        await categoryService.create(formData);
        alert('Categoría creada exitosamente');
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      alert('Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          {category ? ' Editar Categoría' : 'Nueva Categoría'}
        </h3>
        <p className="text-blue-100 text-sm mt-2">
          {category 
            ? 'Actualiza los detalles de tu categoría'
            : 'Crea una nueva categoría para organizar tus tareas'
          }
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
               Nombre
              <span className="text-red-500 text-lg">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-5 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                  errors.name && touchedFields.name
                    ? 'border-red-500 bg-red-50 focus:border-red-600 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                } placeholder-gray-400 text-gray-800 font-medium`}
                placeholder="Ej: Trabajo, Personal, Estudios"
                disabled={loading}
              />
              {formData.name && (
                <span className="absolute right-4 top-3 text-lg">✓</span>
              )}
            </div>
            {errors.name && touchedFields.name && (
              <div className="mt-2 flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                <span>⚠️</span>
                {errors.name}
              </div>
            )}
          </div>

        </div>

        {/* Botones */}
        <div className="flex gap-3 justify-end pt-8 border-t border-gray-200 mt-8">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            ✕ Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Guardando...
              </>
            ) : (
              <>
                 {category ? 'Actualizar' : 'Crear'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CategoryForm;