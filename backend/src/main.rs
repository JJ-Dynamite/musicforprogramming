use axum::{
    routing::{get, post},
    Router,
    Json,
    response::IntoResponse,
};
use serde::{Deserialize, Serialize};
use tower_http::cors::{CorsLayer, Any};
use tracing_subscriber;

#[derive(Serialize)]
struct HealthResponse {
    status: String,
    service: String,
    version: String,
}

#[derive(Serialize)]
struct ApiResponse<T: Serialize> {
    success: bool,
    data: Option<T>,
    error: Option<String>,
}

#[derive(Serialize)]
struct Playlist {
    id: String,
    name: String,
    description: String,
    duration_minutes: u32,
    mood: String,
    bpm_range: String,
    tracks: Vec<Track>,
}

#[derive(Serialize)]
struct Track {
    title: String,
    artist: String,
    duration_seconds: u32,
    ambient: bool,
}

#[derive(Deserialize)]
struct MoodRequest {
    mood: String,
}

async fn health_check() -> impl IntoResponse {
    Json(HealthResponse {
        status: "healthy".to_string(),
        service: "Focus music for coding".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    })
}

async fn root() -> impl IntoResponse {
    Json(ApiResponse::<()> {
        success: true,
        data: None,
        error: None,
    })
}

async fn get_playlists() -> impl IntoResponse {
    let playlists = vec![
        Playlist {
            id: "deep-focus".to_string(),
            name: "Deep Focus".to_string(),
            description: "Ambient sounds for deep concentration".to_string(),
            duration_minutes: 120,
            mood: "focus".to_string(),
            bpm_range: "60-80".to_string(),
            tracks: vec![
                Track { title: "Rain on Window".to_string(), artist: "Nature Sounds".to_string(), duration_seconds: 300, ambient: true },
                Track { title: "Lo-fi Study".to_string(), artist: "Chill Beats".to_string(), duration_seconds: 240, ambient: false },
            ],
        },
        Playlist {
            id: "coding-flow".to_string(),
            name: "Coding Flow".to_string(),
            description: "Electronic beats for programming".to_string(),
            duration_minutes: 90,
            mood: "productive".to_string(),
            bpm_range: "100-120".to_string(),
            tracks: vec![
                Track { title: "Synth Wave".to_string(), artist: "Retro Electronic".to_string(), duration_seconds: 280, ambient: false },
                Track { title: "Digital Dream".to_string(), artist: "Ambient Tech".to_string(), duration_seconds: 320, ambient: true },
            ],
        },
    ];

    Json(ApiResponse {
        success: true,
        data: Some(playlists),
        error: None,
    })
}

async fn get_by_mood(Json(req): Json<MoodRequest>) -> impl IntoResponse {
    let playlist = Playlist {
        id: format!("{}-playlist", req.mood),
        name: format!("{} Vibes", req.mood.chars().next().unwrap().to_uppercase().collect::<String>() + &req.mood[1..]),
        description: format!("Music for {} mood", req.mood),
        duration_minutes: 60,
        mood: req.mood.clone(),
        bpm_range: "80-100".to_string(),
        tracks: vec![
            Track { title: "Mood Track 1".to_string(), artist: "Various".to_string(), duration_seconds: 240, ambient: true },
        ],
    };

    Json(ApiResponse {
        success: true,
        data: Some(playlist),
        error: None,
    })
}

async fn get_stats() -> impl IntoResponse {
    Json(ApiResponse {
        success: true,
        data: Some(serde_json::json!({
            "total_playlists": 234,
            "total_hours": 5678,
            "active_listeners": 12345,
            "focus_score_avg": 8.5
        })),
        error: None,
    })
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health_check))
        .route("/api/playlists", get(get_playlists))
        .route("/api/mood", post(get_by_mood))
        .route("/api/stats", get(get_stats))
        .layer(cors);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001")
        .await
        .unwrap();

    tracing::info!("Focus music for coding backend running on port 3001");
    axum::serve(listener, app).await.unwrap();
}
