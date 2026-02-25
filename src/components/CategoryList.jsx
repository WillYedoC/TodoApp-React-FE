import { useState, useEffect } from 'react';
import { categoryService } from '../services/category.service';
import CategoryForm from './CategoryForm';

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      const categoryList = Array.isArray(data) ? data : data.data || [];
      setCategories(categoryList);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      alert('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleNewCategory = () => {
    setSelectedCategory(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    loadCategories();
    setShowForm(false);
    setSelectedCategory(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedCategory(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formulario */}
      {showForm && (
        <CategoryForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {/* Contenedor principal */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">
              Lista de Categorías
            </h2>
          </div>
          <button
            onClick={handleNewCategory}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md hover:shadow-lg"
          >
            Crear Nueva
          </button>
        </div>

        <div className="p-8">
          {categories.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="text-6xl mb-4">📂</div>
              <p className="text-gray-500 text-lg font-medium mb-2">No hay categorías registradas</p>
              <p className="text-gray-400 text-sm mb-6">Crea tu primera categoría para comenzar a organizar tus tareas</p>
              <button
                onClick={handleNewCategory}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                ➕ Crear Categoría
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-blue-200 bg-blue-50">
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">
                      Nombre
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr 
                      key={category.id} 
                      className="hover:bg-blue-50 transition-colors duration-200 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-blue-100 text-blue-600 font-semibold text-sm group-hover:bg-blue-200 transition-colors">
                          {category.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                        ✓ {category.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryList;