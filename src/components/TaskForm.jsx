import { useState, useEffect } from "react";
import { tareaService } from "../services/task.service";
import { tagService } from "../services/tag.service";
import { categoryService } from "../services/category.service";

function TaskForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    tagIds: [],
    is_completed: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadCategoriesAndTags();
  }, []);

  const loadCategoriesAndTags = async () => {
    try {
      setLoadingData(true);
      const [categoriesData, tagsData] = await Promise.all([
        categoryService.getAll(),
        tagService.getAll(),
      ]);
      const categoriesList = Array.isArray(categoriesData)
        ? categoriesData
        : categoriesData.data || [];
      const tagsList = Array.isArray(tagsData) ? tagsData : tagsData.data || [];

      setCategories(categoriesList);
      setTags(tagsList);
    } catch (error) {
      console.error("Error al cargar categorías y etiquetas:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTagChange = (tagId) => {
    setFormData((prev) => {
      const tagIds = prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId];
      return { ...prev, tagIds };
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    }
    if (formData.title.trim().length < 3) {
      newErrors.title = "El título debe tener al menos 3 caracteres";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setTouchedFields({ title: true, description: true });
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        is_completed: formData.is_completed,
        category_id: formData.categoryId,
        tags: formData.tagIds,
      };

      await tareaService.create(taskData);
      alert("Tarea creada exitosamente");
      onSuccess();
    } catch (error) {
      console.error("Error al crear tarea:", error);
      alert("Error al crear la tarea");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-2xl border border-green-100/50 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 px-8 py-7">
          <h3 className="text-3xl font-bold text-white">➕ Nueva Tarea</h3>
        </div>
        <div className="p-8 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-400 font-medium">
              Cargando categorías y etiquetas...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-2xl border border-green-100/50 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 px-8 py-7 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-300 rounded-full blur-3xl -mr-20 -mt-20"></div>
        </div>
        <div className="relative z-10">
          <h3 className="text-3xl font-bold text-white flex items-center gap-3">
            ➕ Nueva Tarea
          </h3>
          <p className="text-green-100 text-sm mt-2 font-medium">
            Crea una nueva tarea para organizar tu trabajo
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-8 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
      >
        <div className="space-y-7">
          <div>
            <label className="block text-sm font-bold text-white mb-3 flex items-center gap-2">
              ✅ Título
              <span className="text-red-400 text-lg">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-5 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                  errors.title && touchedFields.title
                    ? "border-red-500 bg-red-900/30 focus:border-red-400 focus:ring-2 focus:ring-red-400/50 focus:ring-offset-2 focus:ring-offset-gray-800"
                    : "border-gray-600 bg-gray-800 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-gray-900"
                } placeholder-gray-500 text-white font-medium text-base shadow-sm hover:shadow-md`}
                placeholder="Ej: Completar proyecto, Revisar código..."
                disabled={loading}
              />
              {formData.title && !errors.title && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 text-lg animate-scale-in">
                  ✓
                </span>
              )}
            </div>
            {errors.title && touchedFields.title && (
              <div className="mt-3 flex items-center gap-2 text-red-300 text-sm bg-red-900/30 px-4 py-3 rounded-xl border border-red-700/60 shadow-sm">
                <span className="text-lg">⚠️</span>
                <span className="font-medium">{errors.title}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-3 flex items-center gap-2">
              📝 Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-5 py-3 border-2 border-gray-600 bg-gray-800 text-white rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none font-medium text-base shadow-sm hover:shadow-md placeholder-gray-500 transition-all duration-300 resize-none"
              placeholder="Describe los detalles de tu tarea..."
              rows="4"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-3 flex items-center gap-2">
              📁 Categoría
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-5 py-3 border-2 border-gray-600 bg-gray-800 text-white rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none font-medium text-base shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              disabled={loading}
            >
              <option value="">-- Selecciona una categoría --</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-3 flex items-center gap-2">
              🏷️ Etiquetas
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <label
                    key={tag.id}
                    className="flex items-center gap-3 p-3 border-2 border-gray-600 bg-gray-800 rounded-xl hover:border-emerald-400 transition-all duration-300 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={formData.tagIds.includes(tag.id)}
                      onChange={() => handleTagChange(tag.id)}
                      className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                      disabled={loading}
                    />
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tag.color || "#6B7280" }}
                      />
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors truncate">
                        {tag.name}
                      </span>
                    </div>
                  </label>
                ))
              ) : (
                <p className="text-gray-500 text-sm col-span-2 md:col-span-3">
                  No hay etiquetas disponibles
                </p>
              )}
            </div>
            {formData.tagIds.length > 0 && (
              <p className="text-xs text-emerald-400 mt-3">
                {formData.tagIds.length} etiqueta
                {formData.tagIds.length !== 1 ? "s" : ""} seleccionada
                {formData.tagIds.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-3 p-4 border-2 border-gray-600 bg-gray-800 rounded-xl hover:border-emerald-400 transition-all duration-300 cursor-pointer group">
              <input
                type="checkbox"
                name="is_completed"
                checked={formData.is_completed}
                onChange={handleChange}
                className="w-5 h-5 rounded accent-emerald-500 cursor-pointer"
                disabled={loading}
              />
              <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                ✓ Marcar como completada
              </span>
            </label>
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
            className="px-7 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin text-lg">⏳</span>
                Creando...
              </>
            ) : (
              <>➕ Crear Tarea</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
