import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './Feed.css';
import api from '../services/api';

function Feed() {
    const [publicaciones, setPublicaciones] = useState([]);
    const [comentariosVisibles, setComentariosVisibles] = useState({});

    useEffect(() => {
        api.get('/post/postsFiltered')
            .then(res => setPublicaciones(res.data))
            .catch(err => console.error('Error al cargar posts:', err));
    }, []);

    // para ocultar o ver comentarios
    const toggleComentarios = (id) => {
        setComentariosVisibles(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="feed-page">
            <Navbar />
            <div className="feed-content">



                <h2>Feed</h2>

                <div className="feed-content">




                    {publicaciones.map(pub => (
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
                                    <p><strong>Comentarios</strong></p>
                                    <p>Aquí irán los comentarios del post {pub.id}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>



            </div>
        </div>
    );
}

export default Feed;