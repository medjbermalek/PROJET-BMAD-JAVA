import { useState } from 'react';
import type { FormEvent } from 'react';

type View = 'request' | 'advisor';

type CallbackRequest = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
};

type RequestFields = {
  firstName: string;
  lastName: string;
  phone: string;
};

type FieldErrors = Partial<Record<keyof RequestFields, string>>;

const emptyFields: RequestFields = { firstName: '', lastName: '', phone: '' };
const phonePattern = /^\+?[0-9][0-9().\s-]{5,18}[0-9]$/;

function validate(fields: RequestFields): FieldErrors {
  const errors: FieldErrors = {};
  const digits = fields.phone.replace(/\D/g, '').length;

  if (!fields.firstName.trim()) errors.firstName = 'Le prénom est obligatoire.';
  if (!fields.lastName.trim()) errors.lastName = 'Le nom est obligatoire.';
  if (!phonePattern.test(fields.phone.trim()) || digits < 7 || digits > 15) {
    errors.phone = 'Saisissez un numéro de téléphone valide.';
  }
  return errors;
}

async function readError(response: Response, fallback: string): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message || fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [view, setView] = useState<View>('request');
  const [authenticated, setAuthenticated] = useState(false);
  const [fields, setFields] = useState<RequestFields>(emptyFields);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [requests, setRequests] = useState<CallbackRequest[]>([]);

  function updateField(field: keyof RequestFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
    setFormError('');
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validate(fields);
    setFieldErrors(errors);
    setFormError('');
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      const response = await fetch('/api/callbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(fields),
      });
      if (!response.ok) {
        setFormError(await readError(response, 'Impossible d’enregistrer la demande. Veuillez réessayer.'));
        return;
      }
      setSubmitted(true);
    } catch {
      setFormError('Impossible d’enregistrer la demande. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError('');
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          username: formData.get('username'),
          password: formData.get('password'),
        }),
      });
      if (!response.ok) {
        setLoginError(await readError(response, 'Identifiant ou mot de passe incorrect.'));
        return;
      }

      const requestsResponse = await fetch('/api/callbacks', { credentials: 'same-origin' });
      if (!requestsResponse.ok) {
        setLoginError('Impossible de charger les demandes. Veuillez réessayer.');
        return;
      }
      setRequests((await requestsResponse.json()) as CallbackRequest[]);
      setAuthenticated(true);
      setView('advisor');
    } catch {
      setLoginError('Connexion impossible. Vérifiez que le serveur est disponible.');
    }
  }

  async function logout() {
    setLoginError('');
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
      if (!response.ok) {
        setLoginError('La déconnexion a échoué. Veuillez réessayer.');
        return;
      }
      setRequests([]);
      setAuthenticated(false);
      setView('request');
    } catch {
      setLoginError('La déconnexion a échoué. Veuillez réessayer.');
    }
  }

  function startNewRequest() {
    setFields(emptyFields);
    setFieldErrors({});
    setFormError('');
    setSubmitted(false);
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Accueil, Démo conseil">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>conseil<span className="brand-dot">.</span></span>
        </a>
        <div className="header-note">
          <span className="status-dot" aria-hidden="true" />
          <span>Démonstration locale</span>
        </div>
        {view === 'request' && !submitted ? (
          <a
            className="advisor-link"
            href="#conseiller"
            onClick={(event) => {
              event.preventDefault();
              setLoginError('');
              setView('advisor');
            }}
          >
            Espace conseiller <span aria-hidden="true">↗</span>
          </a>
        ) : <span className="header-spacer" />}
      </header>

      <main>
        {view === 'request' && (
          <section className="page-grid">
            <div className="intro-panel">
              <p className="eyebrow"><span>01</span> — ÊTRE RAPPELÉ</p>
              <h1>Un échange qui<br />commence <em>simplement.</em></h1>
              <p className="intro-copy">
                Laissez vos coordonnées fictives et découvrez le parcours de demande de rappel.
              </p>
              <div className="steps" aria-label="Étapes de la démonstration">
                <div className="step">
                  <span className="step-number">01</span>
                  <span>Vos coordonnées</span>
                  <span className="step-rule" />
                </div>
                <div className="step">
                  <span className="step-number">02</span>
                  <span>Confirmation</span>
                  <span className="step-rule" />
                </div>
                <div className="step">
                  <span className="step-number">03</span>
                  <span>Consultation privée</span>
                </div>
              </div>
              <div className="privacy-note">
                <span className="privacy-icon" aria-hidden="true">✳</span>
                <p><strong>Vos données restent ici.</strong><br />Cette démonstration fonctionne uniquement sur cet ordinateur.</p>
              </div>
            </div>

            <div className="form-panel">
              {submitted ? (
                <section className="confirmation" aria-labelledby="confirmation-title">
                  <div className="confirmation-icon" aria-hidden="true">✓</div>
                  <p className="eyebrow">C’EST NOTÉ</p>
                  <h2 id="confirmation-title">Demande enregistrée</h2>
                  <p>Votre demande fictive a bien été enregistrée.</p>
                  <p className="confirmation-disclaimer">Ceci est une démonstration : aucun rappel réel ne sera effectué.</p>
                  <button className="text-button" type="button" onClick={startNewRequest}>Créer une nouvelle demande <span aria-hidden="true">→</span></button>
                </section>
              ) : (
                <>
                  <div className="form-heading">
                    <div>
                      <p className="eyebrow">VOTRE DEMANDE</p>
                      <h2>Comment vous joindre ?</h2>
                    </div>
                    <span className="required-note">* Champs obligatoires</span>
                  </div>

                  <div className="demo-warning" role="note">
                    <span className="warning-icon" aria-hidden="true">!</span>
                    <p><strong>Mode démonstration</strong><br />N’utilisez que des coordonnées fictives. Aucune personne ne vous contactera.</p>
                  </div>

                  <form className="request-form" noValidate onSubmit={submitRequest}>
                    {Object.keys(fieldErrors).length > 1 && (
                      <div className="error-summary" role="alert">
                        <strong>Quelques corrections sont nécessaires :</strong>
                        <ul>
                          {Object.entries(fieldErrors).map(([field, message]) => (
                            <li key={field}><a href={`#${field}`}>{message}</a></li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="field-row">
                      <div className="field">
                        <label htmlFor="firstName">Prénom <span>*</span></label>
                        <input
                          id="firstName"
                          name="firstName"
                          autoComplete="given-name"
                          value={fields.firstName}
                          aria-invalid={Boolean(fieldErrors.firstName)}
                          aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined}
                          onChange={(event) => updateField('firstName', event.target.value)}
                        />
                        {fieldErrors.firstName && <span className="field-error" id="firstName-error">{fieldErrors.firstName}</span>}
                      </div>
                      <div className="field">
                        <label htmlFor="lastName">Nom <span>*</span></label>
                        <input
                          id="lastName"
                          name="lastName"
                          autoComplete="family-name"
                          value={fields.lastName}
                          aria-invalid={Boolean(fieldErrors.lastName)}
                          aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
                          onChange={(event) => updateField('lastName', event.target.value)}
                        />
                        {fieldErrors.lastName && <span className="field-error" id="lastName-error">{fieldErrors.lastName}</span>}
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="phone">Téléphone fictif <span>*</span></label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="06 12 34 56 78"
                        value={fields.phone}
                        aria-invalid={Boolean(fieldErrors.phone)}
                        aria-describedby={fieldErrors.phone ? 'phone-error' : 'phone-hint'}
                        onChange={(event) => updateField('phone', event.target.value)}
                      />
                      {fieldErrors.phone
                        ? <span className="field-error" id="phone-error">{fieldErrors.phone}</span>
                        : <span className="field-hint" id="phone-hint">Avec ou sans indicatif. 7 à 15 chiffres.</span>}
                    </div>
                    {formError && <p className="form-error" role="alert">{formError}</p>}
                    <button className="primary-button" type="submit" disabled={saving}>
                      {saving ? 'Enregistrement…' : 'Envoyer ma demande'}
                      {!saving && <span aria-hidden="true">→</span>}
                    </button>
                    <p className="form-footnote">En continuant, vous confirmez utiliser des informations fictives.</p>
                  </form>
                </>
              )}
            </div>
          </section>
        )}

        {view === 'advisor' && authenticated && (
          <section className="advisor-wrap">
            <div className="advisor-heading">
              <div>
                <p className="eyebrow"><span>ESPACE PRIVÉ</span> — DÉMONSTRATION</p>
                <h1>Demandes reçues<span className="brand-dot">.</span></h1>
                <p className="intro-copy">Consultez les demandes fictives envoyées depuis ce poste.</p>
              </div>
              <button className="secondary-button" type="button" onClick={logout}>Se déconnecter <span aria-hidden="true">↗</span></button>
            </div>
            {loginError && <p className="form-error" role="alert">{loginError}</p>}
            <div className="request-list">
              <div className="list-heading">
                <span>DEMANDEUR</span>
                <span>TÉLÉPHONE FICTIF</span>
              </div>
              {requests.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon" aria-hidden="true">○</span>
                  <h2>Aucune demande pour le moment</h2>
                  <p>Les nouvelles demandes apparaîtront ici.</p>
                </div>
              ) : requests.map((request) => (
                <div className="request-row" key={request.id}>
                  <span>{request.firstName} {request.lastName}</span>
                  <span>{request.phone}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {view === 'advisor' && !authenticated && (
          <div className="login-overlay" role="presentation">
            <section className="login-card" aria-labelledby="login-title">
              <button className="close-button" type="button" aria-label="Retour au formulaire" onClick={() => {
                setLoginError('');
                setView('request');
              }}>×</button>
              <p className="eyebrow">ACCÈS CONSEILLER</p>
              <h2 id="login-title">Ravi de vous revoir.</h2>
              <p className="login-copy">Connectez-vous pour consulter les demandes de démonstration.</p>
              <form className="request-form" onSubmit={login}>
                <div className="field">
                  <label htmlFor="username">Identifiant</label>
                  <input id="username" name="username" autoComplete="username" required />
                </div>
                <div className="field">
                  <label htmlFor="password">Mot de passe</label>
                  <input id="password" name="password" type="password" autoComplete="current-password" required />
                </div>
                {loginError && <p className="form-error" role="alert">{loginError}</p>}
                <button className="primary-button" type="submit">Se connecter <span aria-hidden="true">→</span></button>
              </form>
              <p className="login-demo-hint">Identifiants de démonstration : admin / admin</p>
            </section>
          </div>
        )}
      </main>

      <footer className="site-footer">
        <span>© Démo Conseil</span>
        <span>Parcours fictif · Aucune donnée transmise</span>
        <span>LOCAL<span className="footer-dot">.</span> ONLY</span>
      </footer>
    </div>
  );
}

export default App;
