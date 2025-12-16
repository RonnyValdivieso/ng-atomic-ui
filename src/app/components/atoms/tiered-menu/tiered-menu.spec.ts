import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TieredMenuComponent } from './tiered-menu';
import { MenuItem } from 'primeng/api';

describe('TieredMenuComponent', () => {
  let component: TieredMenuComponent;
  let fixture: ComponentFixture<TieredMenuComponent>;

  const mockMenuItems: MenuItem[] = [
    {
      label: 'File',
      icon: 'pi pi-file',
      items: [
        { label: 'New', icon: 'pi pi-plus' },
        { label: 'Open', icon: 'pi pi-folder-open' }
      ]
    },
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      items: [
        { label: 'Undo', icon: 'pi pi-undo' },
        { label: 'Redo', icon: 'pi pi-refresh' }
      ]
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TieredMenuComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TieredMenuComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('model', mockMenuItems);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with default size', () => {
    expect(component.size()).toBe('medium');
  });

  it('should render with default variant', () => {
    expect(component.variant()).toBe('default');
  });

  it('should be in popup mode by default', () => {
    expect(component.popup()).toBe(true);
  });

  it('should accept menu items model', () => {
    expect(component.model()).toEqual(mockMenuItems);
  });

  it('should apply small size class', () => {
    fixture.componentRef.setInput('size', 'small');
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.tiered-menu-atom');
    expect(element.classList.contains('tiered-menu-atom--small')).toBeTruthy();
  });

  it('should apply large size class', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.tiered-menu-atom');
    expect(element.classList.contains('tiered-menu-atom--large')).toBeTruthy();
  });

  it('should apply outlined variant class', () => {
    fixture.componentRef.setInput('variant', 'outlined');
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.tiered-menu-atom');
    expect(element.classList.contains('tiered-menu-atom--outlined')).toBeTruthy();
  });

  it('should apply disabled class when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.tiered-menu-atom');
    expect(element.classList.contains('tiered-menu-atom--disabled')).toBeTruthy();
  });

  it('should emit itemClick event', () => {
    const emitSpy = spyOn(component.itemClick, 'emit');
    const mockEvent = { originalEvent: new Event('click'), item: mockMenuItems[0] };
    
    component['handleItemClick'](mockEvent);
    
    expect(emitSpy).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit menuShow event', () => {
    const emitSpy = spyOn(component.menuShow, 'emit');
    
    component['handleShow']();
    
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit menuHide event', () => {
    const emitSpy = spyOn(component.menuHide, 'emit');
    
    component['handleHide']();
    
    expect(emitSpy).toHaveBeenCalled();
  });
});
