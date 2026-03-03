/** Auth endpoints (learners-svc) - package com.gumbo.english */
export const AUTH_GOOGLE = '/auth/android/google';
export const AUTH_LOGOUT = '/auth/android/logout';
export const AUTH_DELETE_ACCOUNT = '/auth/android/account';

/** Onboarding - PUT /api/onboarding (Bearer + X-Package-ID) */
export const ONBOARDING = '/onboarding';

/** Categories - GET /api/categories, optionalAuth */
export const CATEGORIES = '/categories';
export const categoryById = (id) => `/categories/${id}`;
export const categoryTopics = (id) => `/categories/${id}/topics`;

/** Topics - GET /api/topics, optionalAuth */
export const TOPICS = '/topics';
export const topicById = (id) => `/topics/${id}`;
export const topicVideos = (id) => `/topics/${id}/videos`;
export const topicRelated = (id) => `/topics/${id}/related`;

/** Learning modules - GET /api/learning-modules */
export const LEARNING_MODULES = '/learning-modules';
export const learningModuleById = (id) => `/learning-modules/${id}`;

/** Modules by class - GET /api/modules?class=X (1-5) */
export const MODULES = '/modules';

/** User stats - GET /api/users/stats/detailed, POST stats/update (Bearer) */
export const USER_STATS_DETAILED = '/users/stats/detailed';
export const USER_STATS_UPDATE = '/users/stats/update';

/** Progress - POST /api/progress/record (Bearer) */
export const PROGRESS_RECORD = '/progress/record';

/** Videos - GET /api/videos/:id, GET /api/videos/:id/stream, POST view, POST progress (Bearer for progress) */
export const videoById = (id) => `/videos/${id}`;
export const videoStream = (id) => `/videos/${id}/stream`;
export const videoView = (id) => `/videos/${id}/view`;
export const videoProgress = (id) => `/videos/${id}/progress`;

/** MCQs - GET /api/mcqs (query: topic), GET /api/mcqs/:id, POST submit (Bearer) */
export const MCQS = '/mcqs';
export const mcqById = (id) => `/mcqs/${id}`;
export const mcqSubmit = (id) => `/mcqs/${id}/submit`;
