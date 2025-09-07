interface JudicialCondemnationNoticeProps {
  className?: string;
}

export function JudicialCondemnationNotice({ className = '' }: JudicialCondemnationNoticeProps) {
  return (
    <div className={`absolute -top-7 left-3 right-3 z-0 ${className}`}>
      <div className="bg-primary-hover text-white px-3 py-1.5 rounded-t-2xl shadow-lg border border-primary">
        <div className="flex items-center justify-center gap-2">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 850 792">
            <g transform="translate(-1.99,1.8)">
              <path
                d="M426.8,761.5V731h212.5 212.5v30.5 30.5h-212.5-212.5z M23.4,768.75L2.85,747.5 146.7,603.5c79.12-79.2,171.57-171.9,205.44-206l61.59-62-54.42-54.46-54.42-54.46-6.79,6.56c-9.54,9.21-13.81,11.24-23.79,11.3-6.51,0.04-8.91-0.4-12.92-2.37-6.27-3.08-11.57-8.39-14.65-14.65-3.48-7.08-3.44-18.94,0.1-25.6,1.73-3.27,31.12-33.42,97.5-100.05,74.92-75.2,96.07-95.89,100-97.83,7.3-3.59,18.94-3.48,26.04,0.24,10.58,5.54,16.64,15.41,16.71,27.21,0.06,9.48-2.44,14.89-10.96,23.71l-6.73,6.97,130.4,130.4,130.4,130.4,6.65-6.28c9.27-8.74,14.47-11.13,23.97-11.01,5.31,0.07,8.88,0.71,12.23,2.21,5.67,2.53,12.58,9.19,15.25,14.7,2.73,5.64,3.21,16.86,1.01,23.67-1.63,5.06-6.56,10.18-97.36,101.15-70.93,71.07-96.93,96.51-100.64,98.49-4.29,2.28-6.21,2.66-13.5,2.67-6.89,0-9.3-0.42-12.72-2.24-10.6-5.63-16.33-14.27-17.04-25.66-0.63-10.22,1.95-16.42,10.75-25.85l6.88-7.36-54.28-54.28-54.28-54.28L251.77,584.4C138.85,697.48,45.89,790,45.21,790,44.53,790,34.72,780.44,23.4,768.75z M648.3,405l39-39L556.8,235.5,426.3,105l-38.75,38.75c-21.31,21.31-38.75,39.2-38.75,39.75,0,0.99,259.02,260.51,260,260.51,0.28,0,18.05-17.55,39.5-39z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
          <span className="body-xs font-bold tracking-wider">
            Condamnation judiciaire
          </span>
        </div>
      </div>
    </div>
  );
}