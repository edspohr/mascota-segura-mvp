import { DEMO_MODE } from '../../config/demo';

export const DemoBanner = () => {
  if (!DEMO_MODE) return null;

  return (
    <div className="w-full bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center">
      <p className="text-amber-600 text-[10px] font-bold tracking-wide uppercase">
        🛠 MODO DEMO — Los datos son de ejemplo. Ninguna acción afecta la base de datos real.
      </p>
    </div>
  );
};
