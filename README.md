# Task & Expense Manager — Frontend

Angular 22 + Angular Material client for the `task-expense-api` Spring Boot backend. Standalone
components, signal-based auth state, functional interceptors/guards — no NgModules.

## 1. Required backend change: enable CORS

The backend currently has **no CORS configuration**, so the browser will block every request
from `http://localhost:4200` to `http://localhost:8080` until you add one. Add a `CorsConfigurationSource`
bean and wire it into the security filter chain:

```java
// SecurityConfig.java

import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfiguration;
import java.util.List;

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:4200"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

Then reference it in the filter chain (add `.cors(cors -> cors.configurationSource(corsConfigurationSource()))`
right before `.csrf(csrf -> csrf.disable())` in `filterChain(HttpSecurity http)`):

```java
http
    .cors(cors -> cors.configurationSource(corsConfigurationSource()))
    .csrf(csrf -> csrf.disable())
    .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    // ...unchanged from here
```

Also worth fixing while you're in there (see earlier notes from this chat): the port mismatch
between `docker-compose.yml` (5432) and `application.yml`'s datasource URL (1111), and the
hardcoded Groq API key / DB password in the `prod` profile.

## 2. Install and run

```bash
npm install
npm start
```

This serves the app at `http://localhost:4200`. It expects the backend running at
`http://localhost:8080` — change `API_BASE_URL` in `src/app/core/api-config.ts` if yours runs
elsewhere.

## 3. What's here

- **Auth** — `/login`, `/register`. JWT is stored in `localStorage` and attached to every request
  by `authInterceptor`. A 401 response anywhere logs you out and redirects to `/login`.
- **Tasks** (`/tasks`) — paginated table, status filter, create/edit dialog, delete.
- **Expenses** (`/expenses`) — paginated table, category filter, create/edit dialog. Leaving
  category blank on **create** lets the backend's AI categorization fill it in (matches
  `ExpenseService.create`); rows it auto-categorized show a small ✨ badge. On **edit**, category
  is required in the form because the backend leaves the existing category untouched if you send
  a null one on update rather than re-running the AI call — the form reflects that instead of
  offering an option that wouldn't do anything.
- **Errors** — `errorInterceptor` reads the backend's `ApiError` shape (`message` / `details`) and
  surfaces it as a snackbar, so validation errors from `@Valid` show up with the real field-level
  messages.

## 4. Known gaps (not built in this pass)

- No automated tests (matches the backend's current state — see earlier notes on that too).
- No "forgot password" or user profile editing — the backend doesn't expose those endpoints yet.
- `GET /api/users/me` isn't wired up anywhere; the toolbar shows the username from the login/register
  response instead. Wire it in if you add a profile page later.
