import { useState, useEffect } from "react";
import { tareaService } from "../services/task.service";
import TaskForm from "./TaskForm";

function TaskModal({ task, onClose }) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-green-200 text-xs font-semibold uppercase tracking-widest mb-1">
              Tarea #{task.id}
            </p>
            <h3 className="text-2xl font-bold text-white leading-tight">
              {task.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl leading-none ml-4 mt-1 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider w-28">
              Categoría
            </span>
            {task.category ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-900/50 text-blue-300 rounded-lg text-xs font-medium border border-blue-700">
                📁 {task.category.name}
              </span>
            ) : (
              <span className="text-gray-500 text-sm italic">
                Sin categoría
              </span>
            )}
          </div>

          <div className="flex items-start gap-3">
            <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider w-28 pt-1">
              Etiquetas
            </span>
            {task.tags && task.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2.5 py-1 rounded-full text-white text-xs font-medium shadow-sm"
                    style={{ backgroundColor: tag.color || "#6B7280" }}
                  >
                    🏷️ {tag.name}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-500 text-sm italic">
                Sin etiquetas
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
              📝 Descripción
            </span>
            <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-300 leading-relaxed min-h-[80px]">
              {task.description || (
                <span className="text-gray-500 italic">Sin descripción</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider w-28">
            Estado
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
              task.is_completed
                ? "bg-green-900/60 text-green-300 border border-green-700"
                : "bg-yellow-900/60 text-yellow-300 border border-yellow-700"
            }`}
          >
            {task.is_completed ? "✓ Completada" : "⏳ Pendiente"}
          </span>
        </div>
        <div className="px-6 py-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold rounded-xl transition-colors duration-200 border border-gray-600 text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewTask, setViewTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await tareaService.getAll();
      setTasks(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error al cargar tareas:", error);
      alert("Error al cargar las tareas");
    } finally {
      setLoading(false);
    }
  };

  const handleNewTask = () => {
    setSelectedTask(null);
    setShowForm(true);
  };
  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowForm(true);
  };
  const handleView = (task) => {
    setViewTask(task);
  }; 
  const handleCloseModal = () => {
    setViewTask(null);
  }; 
  const handleFormSuccess = () => {
    loadTasks();
    setShowForm(false);
    setSelectedTask(null);
  };
  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedTask(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TaskModal task={viewTask} onClose={handleCloseModal} />
      {showForm && (
        <TaskForm
          task={selectedTask}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-green-600 to-green-500 px-8 py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                ✅ Gestión de Tareas
              </h2>
              <p className="text-green-100 text-sm">
                Organiza y gestiona todas tus tareas
              </p>
            </div>
            <button
              onClick={handleNewTask}
              className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition-colors shadow-md hover:shadow-lg flex items-center gap-2 justify-center"
            >
              <span>➕</span> Nueva Tarea
            </button>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center mt-6">
            <p className="text-white/80 text-xs font-semibold uppercase">
              Total de Tareas
            </p>
            <p className="text-white text-2xl font-bold">{tasks.length}</p>
          </div>
        </div>

        <div className="p-8">
          {tasks.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-500 text-lg font-medium mb-2">
                No hay tareas registradas
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Crea tu primera tarea para comenzar
              </p>
              <button
                onClick={handleNewTask}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Crear Tarea
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-green-200 bg-green-50">
                    {[
                      "ID",
                      "Título",
                      "Descripción",
                      "Categoría",
                      "Etiquetas",
                      "Estado",
                      "Acciones",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-center text-xs font-bold text-green-900 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-green-50 transition-colors duration-200 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-green-100 text-green-600 font-semibold text-sm group-hover:bg-green-200 transition-colors">
                          {task.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 group-hover:text-green-600 transition-colors truncate">
                        {task.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {task.description || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {task.category ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-200">
                            📁 {task.category.name}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {task.tags && task.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1 justify-center">
                            {task.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="px-2 py-1 rounded-full text-white text-xs font-medium shadow-sm"
                                style={{
                                  backgroundColor: tag.color || "#6B7280",
                                }}
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm text-center block">
                            -
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold ${task.is_completed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                        >
                          {task.is_completed ? "✓ Completada" : "⏳ Pendiente"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(task)}
                            className="inline-flex items-center px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1"
                          >
                            👁️ Ver
                          </button>
                          <button
                            onClick={() => handleEdit(task)}
                            className="inline-flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                          >
                            ✏️ Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-gray-100 px-8 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Total de{" "}
            <span className="font-semibold text-gray-800">{tasks.length}</span>{" "}
            tarea{tasks.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TaskList;
