const fs = require('fs');

let content = fs.readFileSync('src/components/Header.tsx', 'utf8');

// 1. Add ChevronLeft and ChevronRight to lucide-react imports
content = content.replace(/import \{ \n  Search,/, "import { \n  Search,\n  ChevronLeft,\n  ChevronRight,");

// 2. Add ScrollableContainer component before Header
const scrollableComponent = `
const ScrollableContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = React.useState(false);
  const [showRight, setShowRight] = React.useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  React.useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [children]);

  const scrollByAmount = (amount: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex items-center w-full overflow-hidden group">
      {showLeft && (
        <div className="absolute left-0 z-10 flex items-center h-full bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent pr-8 pl-0">
          <button onClick={() => scrollByAmount(-300)} className="bg-slate-800/90 hover:bg-slate-700 p-1 rounded-full text-slate-200 backdrop-blur border border-slate-700 shadow-lg transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}
      
      <div 
        ref={scrollRef} 
        onScroll={checkScroll}
        className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none w-full scroll-smooth"
      >
        {children}
      </div>

      {showRight && (
        <div className="absolute right-0 z-10 flex items-center h-full bg-gradient-to-l from-slate-900 via-slate-900/90 to-transparent pl-8 pr-0">
          <button onClick={() => scrollByAmount(300)} className="bg-slate-800/90 hover:bg-slate-700 p-1 rounded-full text-slate-200 backdrop-blur border border-slate-700 shadow-lg transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
`;

content = content.replace(/export const Header: React\.FC<HeaderProps> = \(\{/, scrollableComponent + '\n\nexport const Header: React.FC<HeaderProps> = ({');

// 3. Wrap the flows map with ScrollableContainer
content = content.replace(/<div className="flex items-center gap-1\.5 overflow-x-auto pb-0\.5 scrollbar-none">\s*<span className="text-\[11px\] font-mono uppercase tracking-wider text-slate-500 font-semibold pr-1 shrink-0">\s*Flows:\s*<\/span>/, 
"<div className=\"flex-1 min-w-0 flex items-center\">\n                <span className=\"text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold pr-2 shrink-0\">\n                  Flows:\n                </span>\n                <ScrollableContainer>");
// close it (replace the closing div of the scroll container)
content = content.replace(/}\)}\s*<\/div>/, "})}\n                </ScrollableContainer>\n              </div>");

// 4. Wrap the questions stack map with ScrollableContainer
content = content.replace(/<div className="flex items-center gap-1\.5 overflow-x-auto pb-0\.5 scrollbar-none">\s*\{\(Object\.keys\(STACK_CONFIG\)/, 
"<div className=\"flex-1 min-w-0 flex items-center\">\n                <ScrollableContainer>\n                  {(Object.keys(STACK_CONFIG)");

content = content.replace(/}\)}\s*<\/div>\s*<div className="flex items-center gap-2">/, "})}\n                </ScrollableContainer>\n              </div>\n\n              <div className=\"flex items-center gap-2 shrink-0 ml-2\">");

fs.writeFileSync('src/components/Header.tsx', content);
console.log('Added ScrollableContainer to Header.tsx');
