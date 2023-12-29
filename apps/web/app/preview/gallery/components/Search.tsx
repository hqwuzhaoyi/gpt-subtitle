"use client";

import { setSearchKey, useSearchKey } from "@/atoms/searchKey";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Search({ onSearch }: { onSearch: () => void }) {
  const value = useSearchKey();

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        placeholder="Please enter the name"
        value={value}
        onChange={(e) => {
          setSearchKey(e.target.value);
        }}
      />
      <Button type="submit" onClick={onSearch}>
        Search
      </Button>
    </div>
  );
}
