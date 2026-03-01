import { useState, useEffect } from "react";
import { tagService } from "../services/tag.service";
import TagForm from "./TagForm";
import Modal from './modal';

function TagList() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showTag, setShowTag] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    tagId: null,
    tagName: "",
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const data = await tagService.getAll();
      const tagList = Array.isArray(data) ? data : data.data || [];
      setTags(tagList);
    } catch (error) {
      console.error("Error al cargar etiquetas:", error);
      alert("Error al cargar las etiquetas");
    } finally {
      setLoading(false);
    }
  };

  const handleNewTag = () => {
    setSelectedTag(null);
    setShowForm(true);
  };

  const handleShowTag = (tag) => {
    setSelectedTag(tag);
    setShowTag(true);
  };

  const handleEditTag = (tag) => {
    setSelectedTag(tag);
    setShowForm(true);
  };

  const handleDeleteClick = (tag) => {
    setDeleteModal({
      show: true,
      tagId: tag.id,
      tagName: tag.name,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.tagId === null) return;

    setDeleting(true);
    try {
      await tagService.delete(deleteModal.tagId);
      setTags(tags.filter((t) => t.id !== deleteModal.tagId));
      setDeleteModal({ show: false, tagId: null, tagName: "" });
      alert("Etiqueta eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar etiqueta:", error);
      alert("Error al eliminar la etiqueta");
    } finally {
      setDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    loadTags();
    setShowForm(false);
    setSelectedTag(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedTag(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-slate-900 to-slate-700">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-8 rounded-full bg-gradient-to-r from-blue-200 to-cyan-200 animate-pulse shadow-2xl">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-blue-600 border-r-cyan-600"></div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Cargando Etiquetas
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Por favor espera un momento...
          </p>
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
            <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formulario */}
      {showForm && (
        <TagForm
          tag={selectedTag}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
      <div className="bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700 hover:shadow-3xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-500 px-8 py-12 flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white rounded-full opacity-5"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-4xl font-bold text-white">
                Gestión de Etiquetas
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-200 rounded-full"></div>
              <p className="text-blue-100 text-base font-semibold">
                {tags.length} etiqueta{tags.length !== 1 ? "s" : ""} registrada
                {tags.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={handleNewTag}
            className="relative z-10 bg-white text-blue-300 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center gap-2 active:scale-95"
          >
            <span className="text-2xl">➕</span>
            <span>Nueva Etiqueta</span>
          </button>
        </div>

        <div className="p-8 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
          {tags.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="text-8xl mb-6 animate-bounce">🏷️</div>
              <p className="text-gray-200 text-2xl font-bold mb-3">
                Sin etiquetas aún
              </p>
              <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                Crea tu primera etiqueta para organizar y categorizar tus tareas
                de forma más efectiva
              </p>
              <button
                onClick={handleNewTag}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-lg"
              >
                ➕ Crear Primera Etiqueta
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-700 overflow-hidden shadow-2xl bg-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-800 via-blue-900 to-gray-800 border-b-2 border-blue-500/30">
                      <th
                        scope="col"
                        className="px-6 py-5 text-left text-xs font-bold text-blue-300 uppercase tracking-wider"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-5 text-left text-xs font-bold text-blue-300 uppercase tracking-wider"
                      >
                        Nombre
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-5 text-left text-xs font-bold text-blue-300 uppercase tracking-wider"
                      >
                        Color
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-5 text-center text-xs font-bold text-blue-300 uppercase tracking-wider"
                      >
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {tags.map((tag) => (
                      <tr
                        key={tag.id}
                        className="hover:bg-gradient-to-r hover:from-blue-900/30 hover:to-cyan-900/30 transition-all duration-300 group relative"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <style>{`
                              @keyframes pulse-ring {
                                0% {
                                  box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
                                }
                                70% {
                                  box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
                                }
                                100% {
                                  box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
                                }
                              }
                              .tag-id-badge {
                                animation: pulse-ring 2s infinite;
                              }
                            `}</style>
                            <div className="flex-shrink-0">
                              <span className="inline-flex items-center justify-center w-10 h-10 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full shadow-lg group-hover:shadow-xl transition-all tag-id-badge">
                                {tag.id}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="font-bold text-gray-100 text-base group-hover:text-cyan-400 transition-colors">
                            {tag.name}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4 group-hover:scale-105 transition-transform">
                            <div className="relative">
                              <div
                                className="w-10 h-10 rounded-xl shadow-lg border-2 border-gray-600 group-hover:shadow-xl transition-all group-hover:border-blue-400 ring-2 ring-offset-2 ring-offset-gray-800"
                                style={{
                                  backgroundColor: tag.color || "#6B7280",
                                  ringColor: "rgba(59, 130, 246, 0.3)",
                                }}
                                title={tag.color}
                              />
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 font-semibold mb-1">
                                HEX
                              </p>
                              <span className="text-sm font-mono font-bold text-gray-200 bg-gray-700 px-3 py-1 rounded-lg group-hover:bg-blue-900 transition-colors">
                                {tag.color || "N/A"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => handleShowTag(tag)}
                              className="px-4 py-2 text-xs font-bold text-cyan-400 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-lg hover:from-cyan-900/60 hover:to-blue-900/60 transition-all duration-200 border border-cyan-500/50 hover:shadow-md hover:shadow-cyan-500/20 shadow-sm active:scale-95"
                              title="Ver detalle"
                            >
                              👁️ Ver
                            </button>
                            <button
                              onClick={() => handleEditTag(tag)}
                              className="px-4 py-2 text-xs font-bold text-blue-400 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-lg hover:from-blue-900/60 hover:to-cyan-900/60 transition-all duration-200 border border-blue-500/50 hover:shadow-md hover:shadow-blue-500/20 shadow-sm active:scale-95"
                              title="Editar"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => handleDeleteClick(tag)}
                              className="px-4 py-2 text-xs font-bold text-red-400 bg-gradient-to-r from-red-900/40 to-orange-900/40 rounded-lg hover:from-red-900/60 hover:to-orange-900/60 transition-all duration-200 border border-red-500/50 hover:shadow-md hover:shadow-red-500/20 shadow-sm active:scale-95"
                              title="Eliminar"
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      {showTag && selectedTag && (
        <Modal isOpen={showTag} onClose={() => setShowTag(false)}>
          {/* Header con color de la etiqueta */}
          <div
            className="relative px-8 py-10 text-white overflow-hidden"
            style={{ backgroundColor: selectedTag?.color || "#6B7280" }}
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full -mr-24 -mt-24"></div>
            </div>
            <div className="relative z-10">
              <button
                onClick={() => setShowTag(false)}
                className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-200 hover:scale-110"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h3 className="text-4xl font-bold mb-2">{selectedTag?.name}</h3>
              <p className="text-white/80 text-sm font-semibold">
                ID: #{selectedTag?.id}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 space-y-6">
            {/* Color Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Color Display */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">
                  🎨 Color de la Etiqueta
                </h4>
                <div className="flex items-center gap-4">
                  <div
                    className="w-20 h-20 rounded-lg shadow-lg border-4 border-white"
                    style={{ backgroundColor: selectedTag?.color || "#6B7280" }}
                  />
                  <div>
                    <p className="text-gray-600 text-xs font-semibold mb-1">
                      Código Hexadecimal
                    </p>
                    <p className="text-2xl font-mono font-bold text-gray-900">
                      {selectedTag?.color || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200">
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">
                  👁️ Vista Previa
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block px-4 py-2 rounded-full text-white font-bold text-sm shadow-md"
                      style={{ backgroundColor: selectedTag?.color || "#6B7280" }}
                    >
                      {selectedTag?.name}
                    </span>
                    <span className="text-xs text-gray-500">Grande</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-white font-semibold text-xs shadow-sm"
                      style={{ backgroundColor: selectedTag?.color || "#6B7280" }}
                    >
                      {selectedTag?.name}
                    </span>
                    <span className="text-xs text-gray-500">Pequeña</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ backgroundColor: selectedTag?.color || "#6B7280" }}
                    />
                    <span className="text-sm text-gray-700">{selectedTag?.name}</span>
                    <span className="text-xs text-gray-500">Indicador</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-purple-100">
              <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                ℹ️ Información General
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-1">
                    Identificador
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    #{selectedTag?.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold mb-1">
                    Nombre
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedTag?.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
            <button
              onClick={() => setShowTag(false)}
              className="flex-1 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                setShowTag(false);
                handleEditTag(selectedTag);
              }}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg text-white font-bold rounded-lg transition-all duration-200 shadow-sm"
            >
              ✏️ Editar
            </button>
          </div>
        </Modal>
      )}

      {deleteModal.show && (
        <Modal
          isOpen={deleteModal.show}
          onClose={() =>
            setDeleteModal({ show: false, tagId: null, tagName: "" })
          }
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mb-20"></div>
            </div>
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4v2m0 4v2m0-12a9 9 0 110 18 9 9 0 010-18z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Eliminar Etiqueta</h3>
                </div>
              </div>
              <button
                onClick={() =>
                  setDeleteModal({ show: false, tagId: null, tagName: "" })
                }
                disabled={deleting}
                className="text-white bg-red-700/30 hover:bg-red-700/50 rounded-full p-2 transition-all duration-200 disabled:opacity-50"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
              <p className="text-red-900 font-semibold text-lg mb-2">
                Confirmar eliminación
              </p>
              <p className="text-red-800 text-base mb-3">
                ¿Está completamente seguro de que desea eliminar la etiqueta{" "}
                <span className="font-bold text-red-900">
                  "{deleteModal.tagName}"
                </span>
                ?
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
            <button
              onClick={() =>
                setDeleteModal({ show: false, tagId: null, tagName: "" })
              }
              disabled={deleting}
              className="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-400 text-white-900 font-bold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              No, Cancelar
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 hover:shadow-lg text-white font-bold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {deleting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Eliminando...
                </>
              ) : (
                <>🗑️ Sí, Eliminar</>
              )}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default TagList;
