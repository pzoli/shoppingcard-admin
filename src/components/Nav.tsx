import { Menubar } from 'primereact/menubar';

const Navigation = () => {
    const navlist = [
        {
            label: 'Home', icon: 'pi pi-fw pi-home', command: () => {
                window.location.href = '/';
            }
        },
        {
            label: 'AmountType', icon: 'pi pi-fw pi-calendar', command: () => {
                window.location.href = '/amounttype'
            }
        },
        {
            label: 'Item', icon: 'pi pi-fw pi-calendar', command: () => {
                window.location.href = '/item'
            }
        },
        {
            label: 'Category', icon: 'pi pi-fw pi-calendar', command: () => {
                window.location.href = '/category'
            }
        },
    ];

    return (
        <div>
            <header>
                <nav>
                    <Menubar
                        model={navlist}
                    />
                </nav>
            </header>
        </div>
    )
}
export default Navigation;