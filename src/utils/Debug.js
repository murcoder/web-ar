import GUI from 'lil-gui'

/**
 * Use this class to integrate the debug UI
 */
export default class Debug
{
    constructor()
    {
        this.active = window.location.hash === '#debug'

        if(this.active)
        {
            this.ui = new GUI()
        }
    }
}
