/** Auth endpoints (learners-svc) - package com.gumbo.english */
export const AUTH_GOOGLE = '/auth/android/google';
export const AUTH_LOGOUT = '/auth/android/logout';
export const AUTH_ME = '/auth/me';

/** Onboarding - PUT /api/onboarding (Bearer + X-Package-ID) */
export const ONBOARDING = '/onboarding';

/** Categories - GET /api/categories, optionalAuth */
export const CATEGORIES = '/categories';
export const categoryById = (id) => `/categories/${id}`;
export const categoryComplete = (id) => `/categories/${id}/complete`;
export const categoryTopics = (id) => `/categories/${id}/topics`;
export const categoryStats = (id) => `/categories/${id}/stats`;

/** Topics - GET /api/topics, optionalAuth */
export const TOPICS = '/topics';
export const topicById = (id) => `/topics/${id}`;
export const topicVideos = (id) => `/topics/${id}/videos`;
export const topicRelated = (id) => `/topics/${id}/related`;
export const topicProgress = (id) => `/topics/${id}/progress`;

/** Learning modules - GET /api/learning-modules */
export const LEARNING_MODULES = '/learning-modules';
export const learningModuleById = (id) => `/learning-modules/${id}`;

/** Modules by class - GET /api/modules?class=X (1-5) */
export const MODULES = '/modules';

/** User stats - GET /api/users/stats, GET /api/users/stats/detailed, POST stats/update (Bearer) */
export const USER_STATS = '/users/stats';
export const USER_STATS_DETAILED = '/users/stats/detailed';
export const USER_STATS_UPDATE = '/users/stats/update';

/** Progress - POST /api/progress/record (Bearer) */
export const PROGRESS_RECORD = '/progress/record';

/** Videos - POST /api/videos/:id/view, POST /api/videos/:id/progress (Bearer for progress) */
export const videoView = (id) => `/videos/${id}/view`;
export const videoProgress = (id) => `/videos/${id}/progress`;

/** Questionnaires - GET /api/questionnaires, GET /api/questionnaires/:id, POST submit (Bearer) */
export const QUESTIONNAIRES = '/questionnaires';
export const questionnaireById = (id) => `/questionnaires/${id}`;
export const questionnaireSubmit = (id) => `/questionnaires/${id}/submit`;

/** MCQs - GET /api/mcqs (query: topic), GET /api/mcqs/:id, POST submit (Bearer) */
export const MCQS = '/mcqs';
export const mcqById = (id) => `/mcqs/${id}`;
export const mcqSubmit = (id) => `/mcqs/${id}/submit`;
