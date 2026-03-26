import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './Feed.css';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Feed() {
    const { student } = useAuth();
    const [error, setError] = useState('');
    const [contenidoComment, setContenidoComment] = useState({});
    const [publicaciones, setPublicaciones] = useState([]);
    const [comentariosVisibles, setComentariosVisibles] = useState({});

    //estado del modulo

    const [modalVisible, setModalVisible] = useState(false);
    const [cursos, setCursos] = useState([]);
    const [catedraticos, setCatedraticos] = useState([]);


    const [filtro, setFiltro] = useState('todos');


    // estado del form
    const [tipo, setTipo] = useState('curso');
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [cursoId, setCursoId] = useState('');
    const [catedraticoId, setCatedraticoId] = useState('');
    const [postError, setPostError] = useState('');

    useEffect(() => {
        api.get('/post/postsComments')
            .then(res => setPublicaciones(res.data))
            .catch(err => console.error('Error al cargar posts:', err));
    }, []);

    useEffect(() => {
        fetchPosts();
        // Fetch de  cursos y catedraticos para al dropdown en el form para posts
        Promise.all([
            api.get('/curso/cursos'),
            api.get('/catedratico/catedraticos')
        ]).then(([cursosRes, catedraticosRes]) => {
            setCursos(cursosRes.data);
            setCatedraticos(catedraticosRes.data);
        }).catch(err => console.error('Error al cargar datos:', err));
    }, []);

    const publicacionesFiltradas = filtro === 'todos'
        ? publicaciones
        : publicaciones.filter(pub => pub.tipo === filtro);

    const toggleComentarios = (id) => {
        setComentariosVisibles(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const fetchPosts = () => {
        api.get('/post/postsComments')
            .then(res => setPublicaciones(res.data))
            .catch(err => console.error('Error al cargar posts:', err));
    };

    const handleNewPost = async () => {
        setPostError('');
        if (!titulo.trim() || !contenido.trim()) {
            setPostError('El título y contenido son obligatorios.');
            return;
        }
        if (tipo === 'curso' && !cursoId) {
            setPostError('Selecciona un curso.');
            return;
        }
        if (tipo === 'catedratico' && !catedraticoId) {
            setPostError('Selecciona un catedrático.');
            return;
        }

        try {
            await api.post('/post/newpost', {
                estudianteId: student.id,
                tipo,
                titulo,
                contenido,
                cursoId: tipo === 'curso' ? Number(cursoId) : undefined,
                catedraticoId: tipo === 'catedratico' ? Number(catedraticoId) : undefined,
            });

            // refresca el feed
            fetchPosts();
            setModalVisible(false);

            // limpia el form
            setTipo('curso');
            setTitulo('');
            setContenido('');
            setCursoId('');
            setCatedraticoId('');
        } catch (err) {
            setPostError('Error al crear el post.');
            console.error(err);
        }
    };

    const handleComment = async (postId) => {
        if (!contenidoComment[postId]?.trim()) return;

        try {
            await api.post('/comentario/newcomment', {
                estudianteId: student.id,
                postId,
                contenido: contenidoComment[postId]
            });

            // posts nuevos
            const res = await api.get('/post/postsComments');
            setPublicaciones(res.data);

            // Only clears that post's input
            setContenidoComment(prev => ({ ...prev, [postId]: '' }));
            setError('');
        } catch (err) {
            setError('Error al publicar comentario.');
            console.error(err);
        }
    };

    return (
        <div className="feed-page">
            <Navbar />
            <div className="feed-content">

                <div className="mainHeader">
                    <h2>Feed</h2>

                    <div className="feed-filtros">
                        <button
                            className={filtro === 'todos' ? 'filtro-btn active' : 'filtro-btn'}
                            onClick={() => setFiltro('todos')}
                        >
                            Todos
                        </button>
                        <button
                            className={filtro === 'curso' ? 'filtro-btn active' : 'filtro-btn'}
                            onClick={() => setFiltro('curso')}
                        >
                            Cursos
                        </button>
                        <button
                            className={filtro === 'catedratico' ? 'filtro-btn active' : 'filtro-btn'}
                            onClick={() => setFiltro('catedratico')}
                        >
                            Catedráticos
                        </button>
                    </div>

                    <button className="newpost-btn" onClick={() => setModalVisible(true)} >Nuevo post</button>
                </div>


                { }
                {publicacionesFiltradas.map(pub => (
                    <div key={pub.id} className="post-card">

                        <div className="post-header">
                            <h3>{pub.titulo}</h3>
                            <small>
                                {pub.tipo === 'curso'
                                    ? `Curso: ${pub.curso?.nombre}`
                                    : `Catedrático: ${pub.catedratico?.nombres} ${pub.catedratico?.apellidos}`}
                            </small>
                            <div>
                                <small>
                                    Por: {pub.estudiante?.nombres} {pub.estudiante?.apellidos}
                                </small>
                            </div>
                        </div>

                        <p className="post-contenido">{pub.contenido}</p>

                        <div className="post-footer">
                            <small>
                                {new Date(pub.fecha).toLocaleDateString('es-GT')}
                            </small>
                            <button
                                className="comment-btn"
                                onClick={() => toggleComentarios(pub.id)}
                            >
                                {comentariosVisibles[pub.id] ? 'Ocultar' : 'Comentarios'}
                            </button>
                        </div>

                        {comentariosVisibles[pub.id] && (
                            <div className="comentarios-section">

                                {/* carga de comentarios */}
                                {pub.comentario?.length > 0
                                    ? pub.comentario.map(com => (
                                        <div key={com.id} className="comentario-card">
                                            <p>{com.contenido}</p>
                                            <small>
                                                {com.estudiante?.nombres} {com.estudiante?.apellidos}
                                                {' · '}
                                                {new Date(com.fecha).toLocaleDateString('es-GT')}
                                            </small>
                                        </div>
                                    ))
                                    : <p>No hay comentarios aún.</p>
                                }

                                {/* para nuevos comentarios */}
                                <div className="comment-box">
                                    {error && <small style={{ color: 'red' }}>{error}</small>}
                                    <textarea
                                        placeholder="Escribe un comentario..."
                                        value={contenidoComment[pub.id] || ''}
                                        onChange={e => setContenidoComment(prev => ({
                                            ...prev,
                                            [pub.id]: e.target.value
                                        }))}
                                    />
                                    <button className="comment-btn" onClick={() => handleComment(pub.id)}>
                                        Comentar
                                    </button>
                                </div>

                            </div>
                        )}

                    </div>
                ))}
            </div>

            {/* Modulo para nuevo post */}


            {modalVisible && (
                <div className="modal-overlay" onClick={() => setModalVisible(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Nueva publicación</h3>
                            <button
                                className="modal-close"
                                onClick={() => setModalVisible(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {postError && <p className="modal-error">{postError}</p>}

                        <div className="modal-body">
                            {/* Tipo */}
                            <label>Tipo de publicación</label>
                            <div className="tipo-toggle">
                                <button
                                    className={tipo === 'curso' ? 'active' : ''}
                                    onClick={() => setTipo('curso')}
                                >
                                    Curso
                                </button>
                                <button
                                    className={tipo === 'catedratico' ? 'active' : ''}
                                    onClick={() => setTipo('catedratico')}
                                >
                                    Catedrático
                                </button>
                            </div>

                            {/* Dropdown depending on tipo */}
                            {tipo === 'curso' ? (
                                <>
                                    <label>Curso</label>
                                    <select value={cursoId} onChange={e => setCursoId(e.target.value)}>
                                        <option value="">Selecciona un curso...</option>
                                        {cursos.map(c => (
                                            <option key={c.id} value={c.id}>{c.nombre}</option>
                                        ))}
                                    </select>
                                </>
                            ) : (
                                <>
                                    <label>Catedrático</label>
                                    <select value={catedraticoId} onChange={e => setCatedraticoId(e.target.value)}>
                                        <option value="">Selecciona un catedrático...</option>
                                        {catedraticos.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.nombres} {c.apellidos}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            )}

                            {/* Titulo */}
                            <label>Título</label>
                            <input
                                type="text"
                                placeholder="Título de tu publicación..."
                                value={titulo}
                                onChange={e => setTitulo(e.target.value)}
                            />

                            {/* Contenido */}
                            <label>Contenido</label>
                            <textarea
                                placeholder="¿Qué quieres compartir?"
                                value={contenido}
                                onChange={e => setContenido(e.target.value)}
                            />
                        </div>

                        <div className="modal-footer">
                            <button className="modal-cancel" onClick={() => setModalVisible(false)}>
                                Cancelar
                            </button>
                            <button className="modal-submit" onClick={handleNewPost}>
                                Publicar
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>





    );
}

export default Feed;