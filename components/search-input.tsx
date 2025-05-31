"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SearchInputProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export function SearchInput({ 
  onSearch, 
  placeholder = "Buscar wallpapers..." 
}: SearchInputProps) {
  const [query, setQuery] = useState("");

  // Debounce manual para evitar dependência externa
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setQuery("");
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  }, [query, onSearch]);

  return (
    <motion.form
      className="relative mb-6"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        className="pl-10 pr-10 rounded-full border-muted-foreground/20"
      />
      
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full"
          onClick={handleClear}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </motion.form>
  );
}