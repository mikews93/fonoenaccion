import { ConfigType } from 'shared/types/UppyConfigType';
const { VITE_SWITCH_COOKIE_DOMAIN: cookieDomain } = import.meta.env;

// ----------------------------- LOCAL STORAGE -----------------------------
export const AUTH_PROFILE = 'auth_profile';
export const AUTH_REFRESH = 'auth_refresh';
export const SELECTED_THEME = 'selectedTheme';

// ------------------------- REQUEST STATUS -----------------------
export const REQUEST_STATUS_CODES = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
};

// ----------------------------- SESSION -----------------------------
export const SELECTED_CLIENT = 'selectedClient';
export const SELECTED_PROJECT = 'selectedProject';
export const SIDEBAR_STATE = 'sidebarState';

// ----------------------------- TABLES -----------------------------
export enum TABLE_KEYS {
	REPLACEMENT = 'replacement_table',
	SPIELS = 'spiels_table',
	PERSONAS = 'personas_table',
	UPLOADS = 'uploads_table',
	SCREENGRABS = 'screengrabs_table',
	VIDEOS = 'videos_table',
	PRODUCTS = 'products_table',
	TERMINALS = 'terminal_table',
}

// -------------------------- FORMATS --------------------------------
export const DATE_FORMAT = 'YYYY-MM-DD LT';

// -------------------------- SOCKETS --------------------------------
export enum INGEST_MESSAGES {
	CREATE = 'CREATE',
	UPDATE = 'UPDATE',
	ERROR = 'ERROR',
	LOCKED = 'LOCKED',
	UPLOAD = 'UPLOAD',
	UPLOADED = 'UPLOADED',
}

export enum SOCKET_CHANNELS {
	DONE = 'ingest_done',
	PUBLISH_COMPLETE = 'publish_complete',
}

export enum SOCKET_EVENTS {
	CONNECT = 'connect',
	DISCONNECT = 'disconnect',
	CONNECT_ERROR = 'connect_error',
	RECONNECT = 'reconnect',
	RECONNECT_ATTEMPT = 'reconnect_attempt',
	MESSAGE = 'message',
}

export enum SPIEL_MESSAGES {
	ASSETING = 'asseter_progress',
	ASSETING_COMPLETE = 'assets_complete',
	ASSETING_ERROR = 'assets_error',
	STREAM_START = 'stream_start',
	PROCESSING = 'line_number',
	ENCODING = 'encoder_progress',
	PUBLISH_COMPLETE = 'publish_complete',
	VIDEO_STOP = 'ui_video_stop',
	JOB_DONE = 'job_done',
	ERROR = 'spieler_error',
}

export const SOCKET_PATH = '/trafficker/socket.io';

// ---------------------- NOTIFICATION SOURCES ------------------------
export enum NOTIFICATION_SOURCES {
	INGESTER = 'Ingester',
	SPIELS = 'Spiels',
}
// ---------------------- VIDEO EXTENSIONS ---------------------
export enum VIDEO_EXTENSIONS {
	MP4 = '.mp4',
	AVI = '.avi',
	M4V = '.m4v',
	MPG = '.mpg',
}

// ---------------------- AUDIO EXTENSIONS ---------------------
export enum AUDIO_EXTENSIONS {
	MP3 = '.mp3',
	AAC = '.aac',
	WAV = '.wav',
}

// ---------------------- IMAGE EXTENSIONS ---------------------
export enum IMAGE_EXTENSIONS {
	JPG = '.jpg',
	JPEG = '.jpeg',
	GIF = '.gif',
	BMP = '.bmp',
	PNG = '.png',
	SVG = '.svg',
}

// ---------------------- FONT EXTENSIONS ---------------------
export enum FONT_EXTENSIONS {
	TTF = '.ttf',
	WOFF = '.woff',
	WOFF2 = '.woff2',
	OTF = '.otf',
}

// ------------------------- CONTROLLED KEY -------------------
export const ESCAPE_KEY = 27;
export const ENTER_KEY = 'Enter';

// ------------------------- UPPY ------------------------------
const MB100 = 100 * 1024 * 1024;

export const UPPY_GLOBAL_RESTRICTIONS = {
	maxFileSize: MB100,
};

// ------------------------- SPIELS --------------------
export enum SPIEL_JOB_TYPE {
	PREVIEW = 'preview',
	PUBLISH = 'publish',
}

export const DEBOUNCE_TIME = 500;

export const SPIEL_UPLOAD_CONFIG: ConfigType = {
	restrictions: {
		allowedFileTypes: [
			'.dita',
			'.docx',
			'.xml',
			'.dita',
			'.epub',
			'.asciidoc',
			'.html',
			'.htm',
			'.zip',
			'.ditamap',
			'.adoc',
			'.txt',
		],
		maxNumberOfFiles: 1,
		maxFileSize: UPPY_GLOBAL_RESTRICTIONS.maxFileSize,
	},
	allowMultipleUploadBatches: false,
	autoProceed: true,
	endpoint: 'ingester/ingest',
};

// ------------------------- INSTANCE STATUS --------------------
export enum INSTANCE_STATUS {
	INSTANCE_LAUNCHED = 'instance_launched',
	INSTANCE_REQUESTED = 'instance_requested',
	INSTANCE_DEREGISTERED = 'instance_deregistered',
	INSTANCE_BECOME_ENVIRONMENT = 'become_environment',
}

export enum SESSION_KEYS {
	TAG_MODE = 'tag_mode',
}

// ------------------------- REPLACEMENTS ------------------------
export enum REPLACEMENT_TYPES {
	SUB = 'Substitution',
	ABBR = 'Abbreviation',
	PHONEME = 'Phoneme',
}

// ------------------------- VOICE PREVIEW ------------------------
export const REPLACEMENT_VOICE_TEMPLATES = {
	[REPLACEMENT_TYPES.SUB]: (source: string, replacement: string) =>
		`<sub alias="${replacement}">${source}</sub>`,

	[REPLACEMENT_TYPES.ABBR]: (source: string) =>
		`<sub alias="${source.toUpperCase().split('').join('-')}">${source}</sub>`,

	[REPLACEMENT_TYPES.PHONEME]: (source: string, replacement: string) =>
		`<phoneme alphabet="ipa" ph="${replacement}">${source}</phoneme>`,
};

// ------------------------- LANGUAGES -------------------------
export const EN_US = {
	label: 'English',
	options: [
		{
			value: 'en-US',
			label: 'en-US',
			description: 'United States',
			icon: '🇺🇸',
		},
	],
};

// -------------------- SEARCH PLACEHOLDER -----------------------
export const SCREEN_SEARCH_PLACEHOLDER = {
	personas: 'personas',
	replacements: 'replacements',
	spiels: 'spiels',
	uploads: 'assets',
	videos: 'videos',
};

// -------------------------- COOKIES ----------------------------
export const SWITCH_COOKIE = `vd8-switch-cookie-${cookieDomain}`;

export enum PARTIAL_SERVICES {
	general = 'general',
	swallowing = 'swallowing',
	learning = 'learning',
	speech_therapy = 'speech_therapy',
	hearing = 'hearing',
	language = 'language',
}
