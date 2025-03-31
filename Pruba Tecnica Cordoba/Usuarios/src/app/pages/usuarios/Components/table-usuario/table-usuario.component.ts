import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { LoadingTableComponent } from '../../../../shared/components/loading-table/loading-table.component';
import { LocalStorageService } from '../../../../shared/Services/local-storage.service';
import { GetUsuario, Usuario } from '../../../../shared/models/Usuario';
import { UsuarioService } from '../../Services/usuario.service';
import { tap } from 'rxjs';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ModalInfoComponent } from '../../../../shared/components/modal-info/modal-info.component';
import { Router } from '@angular/router';
import { publicRoutes } from '../../../../core/public-private-routes';
import { CrearUsuarioComponent } from '../crear-usuario/crear-usuario.component';
import { UpdateUsuarioComponent } from '../update-usuario/update-usuario.component';

@Component({
  selector: 'app-table-usuario',
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule, 
    MatToolbarModule,
    MatPaginatorModule, 
    MatSortModule, 
    MatInputModule, 
    MatFormFieldModule,
    LoadingTableComponent
  ],
  templateUrl: './table-usuario.component.html',
  styleUrl: './table-usuario.component.css'
})
export class TableUsuarioComponent implements OnInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['idUsuario', 'nombre', 'apellido', 'cedula', 'correoElectronico', 'fechaHoraUIngreso', 'puntaje', 'nombreClasificacion', 'fechaCreacion', 'actions'];
  dataSource!: MatTableDataSource<Usuario>;
  pageIndex?: number;
  filtro?: string;
  listUsuario: Usuario[] = [];
  loaderTable: boolean = false;

  constructor(
    private localStorageService: LocalStorageService,
    public dialog: MatDialog,
    private usuarioService: UsuarioService,
    private router: Router
  ){}

  ngOnInit(){
    this.GetUsuarios();
  }

  GetUsuarios(){
    const paginacion = this.localStorageService.getIndexPage();
    this.loaderTable = false;

    this.usuarioService.GetUsuarios('null')
    .pipe(
      tap(response => {
        this.paginator._intl.itemsPerPageLabel = 'Tamaño de Página';
        this.pageIndex = paginacion ? parseInt(paginacion) : 0;

        this.listUsuario = response.value;
        this.dataSource = new MatTableDataSource(this.listUsuario);
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator.pageIndex = this.pageIndex;
        this.dataSource.sort = this.sort;
        this.loaderTable = true;
      })
    )
    .subscribe({
      next: () => {
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  handlePageEvent(e: PageEvent) {
    this.pageIndex  = e.pageIndex;
    this.localStorageService.saveIndexPage(this.pageIndex.toString());
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  crearUsuario(){
    const dialogRef = this.dialog.open(CrearUsuarioComponent, {
      width: 'auto',
      maxWidth: '90vw', 
      height: 'auto',
      maxHeight: '80vh', 
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetUsuarios();
    })
  }

  editarUsuario(usuario: GetUsuario){
    const dialogRef = this.dialog.open(UpdateUsuarioComponent, {
      width: 'auto',
      maxWidth: '90vw', 
      height: 'auto',
      maxHeight: '80vh', 
      data: usuario
    });

    dialogRef.afterClosed().subscribe(() => {
      this.GetUsuarios();
    })
  }

  eliminarUsuario(usuario: GetUsuario){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: '¿Estás seguro de que quieres eliminar al usurio?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.usuarioService.DeleteUsuario(usuario.idUsuario)
        .pipe(
          tap(response => {
            this.openModal(response.message)
          })
        )
        .subscribe({
          next: () => {
          },
          error: (err) => {
            console.log(err)
          }
        });
      }
    })
  }

  openModal(Messsage: string){
    const dialogRef = this.dialog.open(ModalInfoComponent, { width: '400px' });
    dialogRef.componentInstance.message = Messsage;

    dialogRef.afterClosed().subscribe(() => {
      this.GetUsuarios();
    })
  }
}
