import Header from '../Header';

export default function HeaderExample() {
  return (
    <div className="space-y-4">
      <Header
        cartItemCount={3}
        isAuthenticated={true}
        userEmail="student@goa.bits-pilani.ac.in"
        onCartClick={() => console.log('Cart clicked')}
        onProfileClick={() => console.log('Profile clicked')}
      />
      <Header
        cartItemCount={0}
        isAuthenticated={false}
        onLoginClick={() => console.log('Login clicked')}
      />
    </div>
  );
}
