import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
        ],
    },
};

const withMDX = createMDX({
    options: {
        remarkPlugins: ["remark-gfm"],
        rehypePlugins: ["rehype-slug", "rehype-pretty-code"],
    },
});

export default withMDX(nextConfig);
