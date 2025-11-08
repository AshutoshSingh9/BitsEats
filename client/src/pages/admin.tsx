import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Vendor {
  id: string;
  name: string;
  contactName: string;
  contactPhone: string;
  email: string;
  active: boolean;
}

interface MenuItem {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
}

export default function Admin() {
  const { toast } = useToast();
  const [isVendorDialogOpen, setIsVendorDialogOpen] = useState(false);
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);

  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: '1',
      name: 'Campus Canteen',
      contactName: 'Ramesh Kumar',
      contactPhone: '+91 98765 43210',
      email: 'canteen@bits.ac.in',
      active: true,
    },
    {
      id: '2',
      name: 'Night Canteen',
      contactName: 'Suresh Patel',
      contactPhone: '+91 87654 32109',
      email: 'night@bits.ac.in',
      active: true,
    },
  ]);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      vendorId: '1',
      name: 'Masala Dosa',
      description: 'Crispy dosa filled with spiced potato',
      price: 60,
      isAvailable: true,
    },
    {
      id: '2',
      vendorId: '1',
      name: 'Paneer Tikka',
      description: 'Grilled paneer with spices',
      price: 120,
      isAvailable: true,
    },
  ]);

  const handleDeleteVendor = (id: string) => {
    setVendors(vendors.filter(v => v.id !== id));
    toast({ title: "Vendor deleted successfully" });
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(m => m.id !== id));
    toast({ title: "Menu item deleted successfully" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={0}
        isAuthenticated={true}
        userEmail="admin@goa.bits-pilani.ac.in"
        onCartClick={() => {}}
        onProfileClick={() => console.log('Profile clicked')}
      />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

        <Tabs defaultValue="vendors" className="w-full">
          <TabsList>
            <TabsTrigger value="vendors" data-testid="tab-vendors">Vendors</TabsTrigger>
            <TabsTrigger value="menu" data-testid="tab-menu">Menu Items</TabsTrigger>
          </TabsList>

          <TabsContent value="vendors" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Manage Vendors</h2>
              <Dialog open={isVendorDialogOpen} onOpenChange={setIsVendorDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-vendor">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vendor
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Vendor</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="vendor-name">Vendor Name</Label>
                      <Input id="vendor-name" placeholder="Campus Canteen" data-testid="input-vendor-name" />
                    </div>
                    <div>
                      <Label htmlFor="contact-name">Contact Name</Label>
                      <Input id="contact-name" placeholder="Ramesh Kumar" data-testid="input-contact-name" />
                    </div>
                    <div>
                      <Label htmlFor="contact-phone">Contact Phone</Label>
                      <Input id="contact-phone" placeholder="+91 98765 43210" data-testid="input-contact-phone" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="vendor@bits.ac.in" data-testid="input-vendor-email" />
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        toast({ title: "Vendor added successfully" });
                        setIsVendorDialogOpen(false);
                      }}
                      data-testid="button-save-vendor"
                    >
                      Add Vendor
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vendors.map((vendor) => (
                <Card key={vendor.id} data-testid={`card-vendor-${vendor.id}`}>
                  <CardHeader>
                    <CardTitle>{vendor.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p><strong>Contact:</strong> {vendor.contactName}</p>
                      <p><strong>Phone:</strong> {vendor.contactPhone}</p>
                      <p><strong>Email:</strong> {vendor.email}</p>
                      <p><strong>Status:</strong> {vendor.active ? 'Active' : 'Inactive'}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        data-testid={`button-edit-vendor-${vendor.id}`}
                      >
                        <Pencil className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteVendor(vendor.id)}
                        data-testid={`button-delete-vendor-${vendor.id}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="menu" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Manage Menu Items</h2>
              <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-menu-item">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Menu Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Menu Item</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="item-name">Item Name</Label>
                      <Input id="item-name" placeholder="Masala Dosa" data-testid="input-item-name" />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input id="description" placeholder="Crispy dosa..." data-testid="input-description" />
                    </div>
                    <div>
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input id="price" type="number" placeholder="60" data-testid="input-price" />
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        toast({ title: "Menu item added successfully" });
                        setIsMenuDialogOpen(false);
                      }}
                      data-testid="button-save-menu-item"
                    >
                      Add Menu Item
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <Card key={item.id} data-testid={`card-menu-item-${item.id}`}>
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">{item.description}</p>
                      <p className="text-lg font-semibold">₹{item.price}</p>
                      <p><strong>Status:</strong> {item.isAvailable ? 'Available' : 'Unavailable'}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        data-testid={`button-edit-menu-${item.id}`}
                      >
                        <Pencil className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteMenuItem(item.id)}
                        data-testid={`button-delete-menu-${item.id}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
