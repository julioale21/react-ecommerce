import * as React from "react";
import { useState } from "react";
import { CartItem, Product } from "../types";
import { Grid, Stack, Text, Flex, Image, Button } from "@chakra-ui/react";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import ProductCard from "product/components/ProductCard";
import CartDrawer from "product/components/CartDrawer";

interface Props {
  products: Product[];
}

const StoreScreen: React.FC<Props> = ({ products }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isCartOpen, toggleCart] = useState<any>(false);

  const handleEditCart = (product: Product, action: "increment" | "decrement") => {
    setCart((cart) => {
      const isInCart = cart.some((item) => item.id === product.id);

      if (!isInCart) {
        return cart.concat({ ...product, quantity: 1 });
      }

      return cart.reduce((acc, _product) => {
        if (product.id !== _product.id) {
          return acc.concat(_product);
        }

        if (action === "decrement") {
          if (_product.quantity === 1) {
            return acc;
          }

          return acc.concat({ ..._product, quantity: _product.quantity - 1 });
        } else if (action === "increment") {
          return acc.concat({ ..._product, quantity: _product.quantity + 1 });
        }

        return acc;
      }, [] as CartItem[]);
    });
  };

  return (
    <AnimateSharedLayout type="crossfade">
      <Stack spacing={6}>
        {Boolean(products.length) ? (
          <Grid gridGap={6} templateColumns="repeat(auto-fill, minmax(240px, 1fr))">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={(product) => handleEditCart(product, "increment")}
                onSelectedImage={(image) => setSelectedImage(image)}
              />
            ))}
          </Grid>
        ) : (
          <Grid>
            <Text color="gray.500" fontSize="lg" margin="auto">
              No hay Productos
            </Text>
          </Grid>
        )}

        {Boolean(cart.length) && (
          <Flex alignItems="center" bottom={4} justifyContent="center" position="sticky">
            <Button
              colorScheme="whatsapp"
              size="lg"
              width={{ base: "100%", sm: "fit-content" }}
              onClick={() => toggleCart(true)}
            >
              Ver pedido ({cart.reduce((acc, product) => acc + product.quantity, 0)} products)
            </Button>
          </Flex>
        )}
        <CartDrawer
          isOpen={isCartOpen}
          items={cart}
          onClose={() => toggleCart(false)}
          onDecrement={(product) => handleEditCart(product, "decrement")}
          onIncrement={(product) => handleEditCart(product, "increment")}
        />
      </Stack>

      <AnimatePresence>
        {selectedImage && (
          <Flex
            key="backdrop"
            alignItems="center"
            as={motion.div}
            backgroundColor="rgba(0,0,0,0.5)"
            height="100%"
            justifyContent="center"
            layoutId={selectedImage}
            left={0}
            position="fixed"
            top={0}
            width="100%"
            onClick={() => setSelectedImage(null)}
          >
            <Image key="image" src={selectedImage} />
          </Flex>
        )}
      </AnimatePresence>
    </AnimateSharedLayout>
  );
};

export default StoreScreen;
