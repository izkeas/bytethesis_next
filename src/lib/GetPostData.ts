import path from "path";
import fs, { link } from "fs"

import Markdown from 'markdown-it';
import prism from 'markdown-it-prism'

import matter from "gray-matter";
import PostMetadata from "./PostMetadata";
import { MetaPage } from "./MetaPage";

function extractSummary(content : string){
  // extract text

  const removeTopicsRegex = /(^#+\s.+)/gm;
  const removeLinksRegex = /\[(.*?)\]\((?:https?:\/\/)?([\w\d\/\\_.-]+)\)/g;
  const removeCodeRegex = /(`{3}(.*?)\n([\w\s\S*]*)```)/g;
  
  let text = content.trim().replaceAll(removeTopicsRegex, "");
  text = text.replace(removeLinksRegex, "$1");
  text = text.replace(removeCodeRegex, "");

  return text.substring(0, 400) + "...";
}


export async function getPostData(language : string, id  : string, withContent=false) : Promise<MetaPage> {
    const fullPath = path.join(`src/content/${language}`, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
    const postMetadata  : PostMetadata = (matterResult.data) as PostMetadata;
    const postLink = `/${ language != "en" ? (language + "/") : ""}posts/${id}`;
    const summary = extractSummary(matterResult.content);

    const newMetaPage :MetaPage = {
      ...postMetadata,
      summary : summary,
      link : postLink
    }

    // Use remark to convert markdown into HTML string
    let contentHtml;

    if (withContent){
      const md = Markdown({
        html : true
      });
  
      md.use(prism)
  
      contentHtml = md.render(matterResult.content);
      newMetaPage.contentHtml = contentHtml;
    }

    return newMetaPage;
  }
  