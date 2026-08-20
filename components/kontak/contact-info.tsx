import React from "react";

export function ContactInfo() {
  return (
    <div className="bg-white rounded-radius-md shadow-card p-space-6 md:p-space-8">
      <div className="space-y-space-6">
        
        {/* Alamat */}
        <div className="flex items-start gap-space-3">
          <div className="mt-1 flex-shrink-0 text-red-signal">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-display font-medium text-navy-deep text-body-lg mb-1">Kantor Pusat</h4>
            <p className="font-body text-slate text-body-md leading-relaxed">
              {/* TODO: replace with real company address once provided by client */}
              Kawasan Industri Estate Raya Kav. 45<br />
              Surabaya, Jawa Timur 60293<br />
              Indonesia
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-space-3">
          <div className="mt-1 flex-shrink-0 text-red-signal">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="font-display font-medium text-navy-deep text-body-lg mb-1">Email</h4>
            <a href="mailto:info@dutamitaluhur.com" className="font-body text-slate hover:text-red-signal transition-colors text-body-md">
              info@dutamitaluhur.com
            </a>
          </div>
        </div>

        {/* Telepon / WhatsApp */}
        <div className="flex items-start gap-space-3">
          <div className="mt-1 flex-shrink-0 text-red-signal">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <h4 className="font-display font-medium text-navy-deep text-body-lg mb-1">Telepon &amp; WhatsApp</h4>
            <a href="tel:+62315550199" className="font-body text-slate hover:text-red-signal transition-colors text-body-md block mb-space-2">
              +62 (31) 555-0199
            </a>
            
            {/* Reusing exact WhatsApp button style from footer */}
            <a
              href="https://wa.me/62XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-space-2 bg-red-signal hover:bg-red-signal/90 text-ivory px-space-3 py-space-1 rounded-radius-sm font-body font-medium text-body-sm transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.77.813 2.796.814h.005c3.18 0 5.767-2.586 5.768-5.766 0-1.54-.6-2.987-1.689-4.078-1.09-1.089-2.538-1.722-4.084-1.722zm0-2.172c2.094 0 4.062.815 5.542 2.296 1.48 1.48 2.296 3.448 2.296 5.543 0 4.322-3.518 7.84-7.839 7.84-1.328 0-2.614-.337-3.754-.977l-4.276 1.121 1.141-4.172c-.703-1.189-1.074-2.551-1.073-3.947.001-4.321 3.518-7.839 7.84-7.839zm0 13.914c1.157 0 2.29-.311 3.279-.899l.235-.14 2.438.64-.651-2.376.153-.244c.646-1.028.987-2.222.987-3.454-.001-3.328-2.709-6.036-6.038-6.036-1.613 0-3.129.628-4.27 1.769-1.141 1.141-1.769 2.658-1.769 4.271 0 3.329 2.708 6.037 6.037 6.037z" />
              </svg>
              <span>Chat via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Jam Operasional */}
        <div className="flex items-start gap-space-3">
          <div className="mt-1 flex-shrink-0 text-red-signal">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-display font-medium text-navy-deep text-body-lg mb-1">Jam Operasional</h4>
            <p className="font-body text-slate text-body-md">
              Senin – Jumat, 08.00 – 17.00 WIB
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
