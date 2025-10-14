"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const CropImage = dynamic(() => import('@/components/CropImage'), { ssr: false });
import { Product } from '@/data/products';
import Image from 'next/image';
import SearchBar from '@/components/SearchBar';
import { fetchProducts, addProduct, deleteProduct } from '@/lib/productsApi';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export default function AdminPage() {
	const [user, setUser] = useState<User | null>(null);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [authError, setAuthError] = useState<string | null>(null);
			const [products, setProducts] = useState<Product[]>([]);
			const [loading, setLoading] = useState(false);
		// Cargar usuario y productos
		useEffect(() => {
			const getUser = async () => {
				const { data } = await supabase.auth.getUser();
				setUser(data.user);
			};
			getUser();
		}, []);

		useEffect(() => {
			if (!user) return;
			setLoading(true);
			fetchProducts()
				.then(setProducts)
				.finally(() => setLoading(false));
		}, [user]);
			// Tipo para el formulario del admin que incluye campos administrativos
			type AdminProductForm = Partial<Product> & { codigo?: string; costo?: number };
			const [form, setForm] = useState<AdminProductForm>({});
			const [preview, setPreview] = useState<string | null>(null);
			const [fileInputKey, setFileInputKey] = useState(0);
			const [rawImage, setRawImage] = useState<string | null>(null);
			const [showCrop, setShowCrop] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [highlightedId, setHighlightedId] = useState<string | null>(null);
	const listRef = React.useRef<HTMLUListElement | null>(null);

	if (!user) {
		return (
					<section className="max-w-md mx-auto mt-16 p-8 border rounded-2xl shadow bg-white dark:bg-neutral-900 my-8">
					<h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">Panel de administración</h2>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						className="w-full border rounded px-3 py-2 mb-2 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
					/>
					<input
						type="password"
						placeholder="Contraseña"
						value={password}
						onChange={e => setPassword(e.target.value)}
						className="w-full border rounded px-3 py-2 mb-4 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
					/>
					<button
						onClick={async () => {
							setAuthError(null);
							const { error } = await supabase.auth.signInWithPassword({ email, password });
							if (error) setAuthError(error.message);
							else {
								const { data } = await supabase.auth.getUser();
								setUser(data.user);
							}
						}}
						className="w-full bg-black text-white py-2 rounded font-medium hover:bg-neutral-800"
					>Entrar</button>
				{authError && <p className="text-xs text-red-500 mt-2">{authError}</p>}
			</section>
		);
	}

	const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
			const { name, value } = e.target;
			// For numeric fields, parse and clamp to >= 0
			if (name === 'price' || name === 'costo') {
				if (value === '') {
					setForm(f => ({ ...f, [name]: undefined }));
					return;
				}
				const parsed = Number(value);
				const safe = Number.isNaN(parsed) ? undefined : Math.max(0, parsed);
				setForm(f => ({ ...f, [name]: safe }));
				return;
			}

			setForm(f => ({ ...f, [name]: value }));
		};

	// Prevent + and - characters on numeric fields (price specifically)
	const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === '+' || e.key === '-') {
			e.preventDefault();
		}
	};

	const handleNumberPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		const text = e.clipboardData.getData('text');
		if (/[+\-]/.test(text)) {
			e.preventDefault();
			const clean = text.replace(/[+\-]/g, '');
			const el = e.target as HTMLInputElement;
			const start = el.selectionStart ?? 0;
			const end = el.selectionEnd ?? 0;
			const newVal = el.value.slice(0, start) + clean + el.value.slice(end);
			// update form value (clamped in handleInput will normalize)
			setForm(f => ({ ...f, [el.name]: newVal }));
		}
	};

			const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
				const file = e.target.files?.[0];
				if (file) {
					const reader = new FileReader();
					reader.onload = ev => {
						setRawImage(ev.target?.result as string);
						setShowCrop(true);
					};
					reader.readAsDataURL(file);
					setForm(f => ({ ...f, image: file.name }));
				}
			};

			const handleCropComplete = (croppedImg: string) => {
				setPreview(croppedImg);
				setShowCrop(false);
				setRawImage(null);
			};
			const handleCropCancel = () => {
				setShowCrop(false);
				setRawImage(null);
				setPreview(null);
				setFileInputKey(k => k + 1);
			};

					const handleAdd = async () => {
						setError(null);
						// Validación: nombre, precio, categoría, imagen, código y costo son obligatorios
						if (!form.name || !form.price || !form.category || !preview || !form.codigo || !form.costo) {
							setError('Por favor completa todos los campos obligatorios: nombre, precio, categoría, código, costo e imagen.');
							return;
						}
						setLoading(true);
						try {
							const newProduct = await addProduct({
								name: form.name,
								description: form.description || '',
								price: Number(form.price),
								codigo: form.codigo,
								costo: Number(form.costo),
							
								image: preview,
								category: form.category,
								user_id: user.id,
							});
							setProducts(ps => [...ps, newProduct]);
							setForm({});
							setPreview(null);
							setFileInputKey(k => k + 1); // Reset file input
						} catch (err) {
							setError((err as Error).message || JSON.stringify(err));
						} finally {
							setLoading(false);
						}
					};
// Botón para cerrar sesión
const handleLogout = async () => {
	await supabase.auth.signOut();
	setUser(null);
};

			const handleDelete = async (id: string) => {
				setLoading(true);
				try {
					await deleteProduct(id);
					setProducts(ps => ps.filter(p => p.id !== id));
				} finally {
					setLoading(false);
				}
			};

		return (
						<section className="max-w-2xl mx-auto mt-12 bg-white dark:bg-neutral-900 my-8 rounded-2xl p-8">
					<div className="flex justify-end mb-4">
						<button onClick={handleLogout} className="text-sm text-secondary hover:underline">Cerrar sesión</button>
					</div>
				<h2 className="text-3xl font-bold mb-8 text-center text-neutral-900 dark:text-neutral-100">Administrar productos</h2>
						<div className="mb-8 p-6 border rounded-2xl shadow bg-white dark:bg-neutral-800">
							{error && <div className="text-red-500 mb-2">{error}</div>}
					<h3 className="font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Agregar nuevo producto</h3>

							<input
								name="name"
								placeholder="Nombre"
								value={form.name || ''}
								onChange={handleInput}
								className="w-full border rounded px-3 py-2 mb-2 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
							/>
							<textarea
								name="description"
								placeholder="Descripción"
								value={form.description || ''}
								onChange={handleInput}
								className="w-full border rounded px-3 py-2 mb-2 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
							/>
							<input
								name="price"
								type="number"
								placeholder="Precio"
								value={form.price || ''}
								onChange={handleInput}
								min={0}
								step="0.01"
								onKeyDown={handleNumberKeyDown}
								onPaste={handleNumberPaste}
								className="w-full border rounded px-3 py-2 mb-2 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
							/>
							{/* Campo obligatorio: Código*/}
							<input
								name="codigo"
								type="text"
								placeholder="Código"
								value={form.codigo || ''}
								onChange={handleInput}
								className="w-full border rounded px-3 py-2 mb-2 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
							/>
							{/* Campo obligatorio: Costo interno */}
							<input
								name="costo"
								type="number"
								placeholder="Costo interno"
								value={form.costo ?? ''}
								onChange={handleInput}
								min={0}
								step="0.01"
								className="w-full border rounded px-3 py-2 mb-2 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
							/>
							<select
								name="category"
								value={form.category || ''}
								onChange={handleInput}
								className="w-full border rounded px-3 py-2 mb-2 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
							>
							<option value="">Selecciona categoría</option>
							<option value="herraje">Herraje</option>
							<option value="pega">Pega</option>
							<option value="puerta">Puerta</option>
							<option value="tablero">Tablero</option>
						</select>
											<input
															key={fileInputKey}
															type="file"
															accept="image/*"
															onChange={handleImage}
															className="hidden"
															id="file-upload"
															disabled={showCrop}
													/>
													<label htmlFor="file-upload" className="inline-block mb-2 px-4 py-2 bg-neutral-100 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100 rounded cursor-pointer font-medium shadow hover:bg-neutral-200 dark:hover:bg-neutral-600 transition">
														Elegir archivo
													</label>
											{showCrop && rawImage && (
												<CropImage
													image={rawImage}
													aspect={5/3}
													onCropComplete={handleCropComplete}
													onCancel={handleCropCancel}
												/>
											)}
											{preview && !showCrop && (
												<Image
													src={preview}
													alt="Vista previa"
													width={128}
													height={96}
													className="w-32 h-24 object-cover rounded mb-2"
												/>
											)}
					<button onClick={handleAdd} className="w-full bg-black text-white py-2 rounded font-medium mt-2 hover:bg-neutral-800" disabled={loading}>
							{loading ? 'Guardando...' : 'Agregar producto'}
					</button>
				</div>
				<div>
					{/* Search for existing products */}
					<div className="mb-4 w-full">
						<SearchBar value={search} onChange={setSearch} onSelect={(p) => {
							setHighlightedId(p.id);
							setTimeout(() => setHighlightedId(null), 3000);
							const el = document.getElementById(`prod-${p.id}`);
							if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
						}} />
					</div>
					<h3 className="font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Productos existentes</h3>
					{loading && <div className="text-neutral-700 dark:text-neutral-300 mb-2">Cargando...</div>}
						<ul ref={listRef} className="divide-y divide-gray-100 dark:divide-neutral-800">
							{products.map((prod) => (
								<li id={`prod-${prod.id}`} key={prod.id} className={`flex items-center gap-4 py-4 ${highlightedId === prod.id ? 'bg-yellow-50' : ''}`}>
								<Image
									src={prod.image}
									alt={prod.name}
									width={80}
									height={64}
									className="w-20 h-16 object-cover rounded"
								/>
										<div className="flex-1">
											<div className="font-semibold text-neutral-900 dark:text-neutral-100">{prod.name}</div>
											<div className="text-neutral-700 dark:text-neutral-300 text-sm">{prod.category}</div>
										</div>
								<button onClick={() => handleDelete(prod.id)} className="ml-2 text-red-500 hover:underline" disabled={loading}>Eliminar</button>
							</li>
						))}
					</ul>
				</div>
			</section>
		);
}