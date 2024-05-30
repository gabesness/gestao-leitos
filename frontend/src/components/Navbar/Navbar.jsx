import React, { useState } from 'react';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBIcon,
  MDBCollapse,
  MDBDropdown,
  MDBDropdownMenu, 
  MDBDropdownToggle, 
  MDBDropdownItem
} from 'mdb-react-ui-kit';

export default function Navbar() {
  const [openNavSecond, setOpenNavSecond] = useState(false);

  return (
    <MDBNavbar expand='lg' light bgColor='light'>
      <MDBContainer fluid>
        <MDBNavbarBrand href='#'>Sistema</MDBNavbarBrand>
        <MDBNavbarToggler
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setOpenNavSecond(!openNavSecond)}
        >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>
        <MDBCollapse navbar open={openNavSecond}>
          <MDBNavbarNav>
            <MDBNavbarLink active aria-current='page' href='#'>
            <MDBIcon icon='home' fas style={{ fontSize: '1.2rem' }}/>
            </MDBNavbarLink>

            <MDBNavbarLink href='#'>
            <MDBIcon icon='columns' fas style={{ fontSize: '1.2rem' }}/>
            </MDBNavbarLink>
            
            <MDBNavbarLink href='#'>
            <MDBIcon icon='hospital-user' fas style={{ fontSize: '1.2rem' }}/>
            </MDBNavbarLink>

            <MDBNavbarLink href='#'>
            <MDBIcon icon='chart-area' fas style={{ fontSize: '1.2rem' }}/>
            </MDBNavbarLink>

          </MDBNavbarNav>

          <div className="ms-auto d-flex align-items-center">
          <MDBNavbarNav right>
          <MDBNavbarLink className="d-flex align-items-center" style={{width: "210px"}}>
          <span style={{ fontSize: '1.2rem' }}>Bom dia, João</span>
          <MDBIcon icon='user-circle' fas className='ms-2' style={{ fontSize: '1.5rem' }}/>
          <MDBIcon icon='sign-out-alt' fas className='ms-2' style={{ fontSize: '1.2rem' }}/>
              </MDBNavbarLink>
          </MDBNavbarNav>
          </div>

        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}