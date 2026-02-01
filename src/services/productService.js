import { supabase } from '../config/supabase';

export const productService = {
    // Get all products
    async getAll() {
        const { data, error } = await supabase
            .from('products')
            .select(`
        *,
        categories (
          id,
          name
        )
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get product by ID
    async getById(id) {
        const { data, error } = await supabase
            .from('products')
            .select(`
        *,
        categories (
          id,
          name
        )
      `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Get products by category
    async getByCategory(categoryId) {
        const { data, error } = await supabase
            .from('products')
            .select(`
        *,
        categories (
          id,
          name
        )
      `)
            .eq('category_id', categoryId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Create new product
    async create(productData) {
        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update product
    async update(id, productData) {
        const { data, error } = await supabase
            .from('products')
            .update(productData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete product
    async delete(id) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Upload product image
    async uploadImage(file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

        return data.publicUrl;
    },

    // Delete product image
    async deleteImage(imageUrl) {
        const fileName = imageUrl.split('/').pop();

        const { error } = await supabase.storage
            .from('product-images')
            .remove([fileName]);

        if (error) throw error;
    }
};
