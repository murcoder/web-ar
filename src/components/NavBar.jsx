import { useTranslation } from 'react-i18next';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink
} from '@/components/ui/navigation-menu';
import { useSceneStore } from '@/stores/sceneStore';

export default function NavBar () {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useSceneStore();

  const currentLanguageLabel = language === 'de' ? 'Deutsch' : 'English';

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang).then(() => {
      setLanguage(lang);
    });
  };

  return (
    <header className="bg-education-900/80 sticky top-0 z-40 h-16 w-full px-2">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 text-white">
        {/* Logo + Title */}
        <div className="flex items-center">
          <img src="./icons/logo.svg" alt="Logo" className="h-8 w-8" />
          <span className="text-2xl font-extrabold font-logo ml-2">
            {t('title')}
          </span>
        </div>

        {/* Navigation Menu */}
        <NavigationMenu viewport={false}>
          <NavigationMenuList className="flex items-center gap-6">

            {/* Language dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="uppercase font-bold text-black">
                {currentLanguageLabel}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="absolute top-full right-0 mt-2  text-black rounded-md p-2 shadow-lg w-32">
                <ul className="flex flex-col gap-1">
                  <li>
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => changeLanguage('en')}
                        className={`cursor-pointer w-full text-left px-2 py-1 uppercase font-bold rounded ${
                          i18n.language === 'en' ? 'font-bold' : ''
                        }`}
                      >
                        English
                      </button>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <button
                        onClick={() => changeLanguage('de')}
                        className={`cursor-pointer w-full text-left px-2 py-1 uppercase font-bold rounded  ${
                          i18n.language === 'de' ? 'font-bold' : ''
                        }`}
                      >
                        Deutsch
                      </button>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
